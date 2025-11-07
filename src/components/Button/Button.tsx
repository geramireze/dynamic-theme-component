'use client';

import type { ButtonProps } from './Button.types';
import './Button.scss';

/**
 * Shared/Default Button Implementation
 *
 * This is the fallback implementation used when a bank-specific variant
 * doesn't exist. It provides a standard button component.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  'data-testid': testId = 'button-shared',
}: ButtonProps) {
  const classes = ['button', variant, size, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </button>
  );
}