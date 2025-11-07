/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Type declarations for component imports
 * These allow TypeScript to recognize both direct and aliased imports
 */

// Direct component imports (e.g., import Button from '@/components/Button')
declare module '@/components/Button' {
  import { ButtonProps } from '@/components/Button/Button.types';
  const Button: React.FC<ButtonProps>;
  export default Button;
}

declare module '@/components/DatePicker' {
  import { DatePickerProps } from '@/components/DatePicker/DatePicker.types';
  const DatePicker: React.FC<DatePickerProps>;
  export default DatePicker;
}

// Generic fallback for any component
declare module '@/components/*' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '@/components/*/index' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

declare module '@/components/*/*' {
  import { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}

// Extend process.env types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BUILD_THEME?: 'BBOG' | 'BOCC' | 'BAVV' | 'BPOP';
      NEXT_PUBLIC_THEME: string;
      NEXT_PUBLIC_BRAND_KEY: string;
    }
  }
}

export {};
