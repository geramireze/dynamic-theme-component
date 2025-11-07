'use client';

import { useState, useRef, useEffect } from 'react';
import type { DatePickerProps } from '../DatePicker.types';
import './DatePicker.scss';

/**
 * BBOG-Specific DatePicker Implementation
 *
 * This implementation is automatically loaded when BUILD_THEME=BBOG.
 * It provides a BBOG-branded experience with custom styling and behavior.
 *
 * Key differences from shared:
 * - BBOG brand colors and styling
 * - Two-column layout (month selector on left, calendar on right)
 * - Month/year navigation buttons
 * - Different animation and interaction patterns
 */
export default function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'DD/MM/YYYY',
  minDate,
  maxDate,
  disabled = false,
  error,
  helperText,
  dateFormat = 'dd/MM/yyyy',
  className = '',
  'data-testid': testId = 'datepicker-bbog',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Format date to string (BBOG prefers dd/MM/yyyy)
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    setInputValue(formatDate(value || null));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('es-CO', { month: 'long' });
  const year = currentMonth.getFullYear();

  const containerClasses = [
    'datepicker-bbog',
    disabled && 'datepicker-bbog--disabled',
    error && 'datepicker-bbog--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} ref={containerRef} data-testid={testId}>
      {label && <label className="datepicker-bbog__label">{label}</label>}

      <div className="datepicker-bbog__input-container">
        <input
          type="text"
          className="datepicker-bbog__input"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          data-testid={`${testId}-input`}
        />
        <svg
          className="datepicker-bbog__icon"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
          <path d="M7 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <div className="datepicker-bbog__dropdown" data-testid={`${testId}-dropdown`}>
          <div className="datepicker-bbog__content">
            <div className="datepicker-bbog__sidebar">
              <div className="datepicker-bbog__month-selector">
                <button
                  type="button"
                  className="datepicker-bbog__nav-button"
                  onClick={() => navigateMonth('prev')}
                  aria-label="Previous month"
                >
                  ←
                </button>
                <div className="datepicker-bbog__month-year">
                  <div className="datepicker-bbog__month-name">{monthName}</div>
                  <div className="datepicker-bbog__year">{year}</div>
                </div>
                <button
                  type="button"
                  className="datepicker-bbog__nav-button"
                  onClick={() => navigateMonth('next')}
                  aria-label="Next month"
                >
                  →
                </button>
              </div>

              <button
                type="button"
                className="datepicker-bbog__today-button"
                onClick={() => {
                  const today = new Date();
                  onChange(today);
                  setCurrentMonth(today);
                  setIsOpen(false);
                }}
                data-testid={`${testId}-today`}
              >
                Hoy
              </button>
            </div>

            <div className="datepicker-bbog__calendar">
              <div className="datepicker-bbog__weekdays">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
                  <div key={`${day}-${index}`} className="datepicker-bbog__weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="datepicker-bbog__days">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="datepicker-bbog__day datepicker-bbog__day--empty" />;
                  }

                  const isSelected = value && date.toDateString() === value.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();

                  const dayClasses = [
                    'datepicker-bbog__day',
                    isSelected && 'datepicker-bbog__day--selected',
                    isToday && 'datepicker-bbog__day--today',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      key={index}
                      type="button"
                      className={dayClasses}
                      onClick={() => handleDateSelect(date)}
                      data-testid={`${testId}-day-${date.getDate()}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="datepicker-bbog__error" data-testid={`${testId}-error`}>
          {error}
        </div>
      )}

      {helperText && !error && (
        <div className="datepicker-bbog__helper" data-testid={`${testId}-helper`}>
          {helperText}
        </div>
      )}

      <div className="datepicker-bbog__badge">BBOG</div>
    </div>
  );
}
