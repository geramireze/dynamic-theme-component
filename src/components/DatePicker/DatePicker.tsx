'use client';

import { useState, useRef, useEffect } from 'react';
import type { DatePickerProps } from './DatePicker.types';
import './DatePicker.scss';

/**
 * Shared/Default DatePicker Implementation
 *
 * This is the fallback implementation used when a bank-specific variant
 * doesn't exist. It provides a basic, functional date picker with a
 * calendar dropdown.
 *
 * This component is automatically resolved by the build system when
 * no bank-specific implementation is available.
 */
export default function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select a date',
  minDate,
  maxDate,
  disabled = false,
  error,
  helperText,
  dateFormat = 'MM/dd/yyyy',
  className = '',
  'data-testid': testId = 'datepicker-shared',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Format date to string
  const formatDate = (date: Date | null): string => {
    if (!date) return '';

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    if (dateFormat === 'dd/MM/yyyy') {
      return `${day}/${month}/${year}`;
    }
    return `${month}/${day}/${year}`;
  };

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(formatDate(value || null));
  }, [value]);

  // Close calendar on outside click
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

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const current = value || new Date();
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonth = (value || new Date()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const containerClasses = [
    'datepicker-shared',
    disabled && 'datepicker-shared--disabled',
    error && 'datepicker-shared--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} ref={containerRef} data-testid={testId}>
      {label && <label className="datepicker-shared__label">{label}</label>}

      <div className="datepicker-shared__input-container">
        <input
          type="text"
          className="datepicker-shared__input"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          data-testid={`${testId}-input`}
        />
        <span className="datepicker-shared__icon" onClick={() => !disabled && setIsOpen(!isOpen)}>
          📅
        </span>
      </div>

      {isOpen && !disabled && (
        <div className="datepicker-shared__dropdown" data-testid={`${testId}-dropdown`}>
          <div className="datepicker-shared__header">
            <span className="datepicker-shared__month">{currentMonth}</span>
          </div>

          <div className="datepicker-shared__calendar">
            <div className="datepicker-shared__weekdays">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="datepicker-shared__weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="datepicker-shared__days">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="datepicker-shared__day datepicker-shared__day--empty" />;
                }

                const isSelected = value && date.toDateString() === value.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();

                const dayClasses = [
                  'datepicker-shared__day',
                  isSelected && 'datepicker-shared__day--selected',
                  isToday && 'datepicker-shared__day--today',
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

          <div className="datepicker-shared__footer">
            <button
              type="button"
              className="datepicker-shared__clear"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              data-testid={`${testId}-clear`}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="datepicker-shared__error" data-testid={`${testId}-error`}>
          {error}
        </div>
      )}

      {helperText && !error && (
        <div className="datepicker-shared__helper" data-testid={`${testId}-helper`}>
          {helperText}
        </div>
      )}

      <div className="datepicker-shared__badge">Shared</div>
    </div>
  );
}
