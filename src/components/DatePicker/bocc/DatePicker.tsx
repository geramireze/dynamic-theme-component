'use client';

import { useState, useRef, useEffect } from 'react';
import type { DatePickerProps } from '../DatePicker.types';
import './DatePicker.scss';

/**
 * BOCC-Specific DatePicker Implementation
 *
 * This implementation is automatically loaded when BUILD_THEME=BOCC.
 * It provides a BOCC-branded experience with a minimalist, modern design.
 *
 * Key differences from shared and BBOG:
 * - BOCC brand colors (orange/red accent)
 * - Minimalist single-panel layout
 * - Inline month/year navigation
 * - Sleek animations and modern styling
 * - Different interaction patterns
 */
export default function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Selecciona una fecha',
  minDate,
  maxDate,
  disabled = false,
  error,
  helperText,
  dateFormat = 'dd/MM/yyyy',
  className = '',
  'data-testid': testId = 'datepicker-bocc',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

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
    'datepicker-bocc',
    disabled && 'datepicker-bocc--disabled',
    error && 'datepicker-bocc--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} ref={containerRef} data-testid={testId}>
      {label && <label className="datepicker-bocc__label">{label}</label>}

      <div className="datepicker-bocc__input-container">
        <input
          type="text"
          className="datepicker-bocc__input"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          data-testid={`${testId}-input`}
        />
        <div className="datepicker-bocc__icon" onClick={() => !disabled && setIsOpen(!isOpen)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="14" r="1" fill="currentColor" />
            <circle cx="12" cy="14" r="1" fill="currentColor" />
            <circle cx="16" cy="14" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="datepicker-bocc__dropdown" data-testid={`${testId}-dropdown`}>
          <div className="datepicker-bocc__header">
            <button
              type="button"
              className="datepicker-bocc__nav-button"
              onClick={() => navigateMonth('prev')}
              aria-label="Mes anterior"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="datepicker-bocc__month-year">
              <span className="datepicker-bocc__month">{monthName}</span>
              <span className="datepicker-bocc__year">{year}</span>
            </div>

            <button
              type="button"
              className="datepicker-bocc__nav-button"
              onClick={() => navigateMonth('next')}
              aria-label="Mes siguiente"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="datepicker-bocc__calendar">
            <div className="datepicker-bocc__weekdays">
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((day, index) => (
                <div key={`${day}-${index}`} className="datepicker-bocc__weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="datepicker-bocc__days">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="datepicker-bocc__day datepicker-bocc__day--empty" />;
                }

                const isSelected = value && date.toDateString() === value.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();

                const dayClasses = [
                  'datepicker-bocc__day',
                  isSelected && 'datepicker-bocc__day--selected',
                  isToday && 'datepicker-bocc__day--today',
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

          <div className="datepicker-bocc__footer">
            <button
              type="button"
              className="datepicker-bocc__action-button datepicker-bocc__action-button--clear"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              data-testid={`${testId}-clear`}
            >
              Limpiar
            </button>
            <button
              type="button"
              className="datepicker-bocc__action-button datepicker-bocc__action-button--today"
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
        </div>
      )}

      {error && (
        <div className="datepicker-bocc__error" data-testid={`${testId}-error`}>
          {error}
        </div>
      )}

      {helperText && !error && (
        <div className="datepicker-bocc__helper" data-testid={`${testId}-helper`}>
          {helperText}
        </div>
      )}

      <div className="datepicker-bocc__badge">BOCC</div>
    </div>
  );
}
