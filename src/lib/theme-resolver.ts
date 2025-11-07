export const VALID_THEMES = ['bbog', 'bocc', 'bavv', 'bpop'] as const;
export type Theme = typeof VALID_THEMES[number];

/**
 * Gets the current build theme from environment variables
 */
export function getCurrentTheme(): Theme {
  const theme = (process.env.BUILD_THEME || 'BBOG').toLowerCase() as Theme;

  if (!VALID_THEMES.includes(theme)) {
    throw new Error(
      `Invalid BUILD_THEME: ${theme}. Must be one of: ${VALID_THEMES.join(', ')}`
    );
  }

  return theme;
}

export function getComponentResolutionPattern(theme: Theme) {
  return {
    componentPattern: (componentName: string) => [
      `@/components/${componentName}/${theme}/${componentName}`,
      `@/components/${componentName}/${componentName}`,
    ],
  };
}

export function getThemeFromClient(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_THEME || 'BBOG';
  }
  return process.env.NEXT_PUBLIC_THEME || 'BBOG';
}
