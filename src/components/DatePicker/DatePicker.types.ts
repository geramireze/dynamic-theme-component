/**
 * Shared type definitions for DatePicker component
 *
 * All DatePicker variants (shared, BBOG, BOCC, etc.) must implement this interface
 * to ensure consistency across different bank implementations.
 */

export interface DatePickerProps {
  /**
   * Currently selected date
   */
  value?: Date | null;

  /**
   * Callback fired when date changes
   */
  onChange: (date: Date | null) => void;

  /**
   * Label displayed above the date picker
   */
  label?: string;

  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Format for displaying the date (e.g., "MM/dd/yyyy", "dd/MM/yyyy")
   */
  dateFormat?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;
}
