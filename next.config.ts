/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
const path = require('path');
const fs = require('fs');

const THEME = process.env.BUILD_THEME || 'BBOG';
const VALID_THEMES = ['BBOG', 'BOCC', 'BAVV', 'BPOP'] as const;

if (!VALID_THEMES.includes(THEME as any)) {
  throw new Error(`Invalid theme: ${THEME}. Use: ${VALID_THEMES.join(', ')}`);
}

const BRAND_KEY: Record<string, string> = {
  BBOG: 'BBOG',
  BOCC: 'BOCC',
  BAVV: 'BAVV',
  BPOP: 'BPOP',
};

// Theme lowercase for paths
const themeLower = THEME.toLowerCase();

// Read theme Sass variables
const themeVariablesPath = path.join(__dirname, 'src', 'styles', 'themes', themeLower, '_variables.scss');
const themeVariables = fs.existsSync(themeVariablesPath)
  ? fs.readFileSync(themeVariablesPath, 'utf8')
  : '';

// Read Sass mixins
const mixinsPath = path.join(__dirname, 'src', 'styles', '_mixins.scss');
const mixinsContent = fs.existsSync(mixinsPath)
  ? fs.readFileSync(mixinsPath, 'utf8')
  : '';


function createThemeResolveConfig(theme: string) {
  const componentsDir = path.join(__dirname, 'src', 'components');
  const aliases: Record<string, string> = {};

  // Only proceed if components directory exists
  if (!fs.existsSync(componentsDir)) {
    return aliases;
  }

  // Get all component directories
  const componentDirs = fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => dirent.name);

  for (const componentName of componentDirs) {
    const componentPath = path.join(componentsDir, componentName);
    const themeSpecificPath = path.join(componentPath, theme);

    // Check for theme-specific implementation
    const themeSpecificFiles = [
      path.join(themeSpecificPath, `${componentName}.tsx`),
      path.join(themeSpecificPath, `${componentName}.ts`),
      path.join(themeSpecificPath, 'index.tsx'),
      path.join(themeSpecificPath, 'index.ts'),
    ];

    const themeSpecificExists = themeSpecificFiles.some(file => fs.existsSync(file));

    // Check for shared implementation
    const sharedFiles = [
      path.join(componentPath, `${componentName}.tsx`),
      path.join(componentPath, `${componentName}.ts`),
    ];

    const sharedExists = sharedFiles.some(file => fs.existsSync(file));

    if (themeSpecificExists) {
      // Prioritize theme-specific
      const existingFile = themeSpecificFiles.find(file => fs.existsSync(file));
      if (existingFile) {
        aliases[`@/components/${componentName}$`] = existingFile;
        aliases[`@/components/${componentName}/${componentName}$`] = existingFile;
      }
    } else if (sharedExists) {
      // Fallback to shared
      const existingFile = sharedFiles.find(file => fs.existsSync(file));
      if (existingFile) {
        // Pattern 1: @/components/ComponentName (exact match)
        aliases[`@/components/${componentName}$`] = existingFile;
        // Pattern 2: @/components/ComponentName/ComponentName (exact match)
        aliases[`@/components/${componentName}/${componentName}$`] = existingFile;
      }
    }
  }

  return aliases;
}

const nextConfig: NextConfig = {
  reactCompiler: true,

  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
    prependData: `${themeVariables}\n${mixinsContent}\n`,
  },

  env: {
    NEXT_PUBLIC_THEME: THEME,
    NEXT_PUBLIC_BRAND_KEY: BRAND_KEY[THEME],
  },

  distDir: `build/${themeLower}`,

  webpack: (config: Configuration, { isServer }) => {
    // Create theme-specific component aliases
    const themeAliases = createThemeResolveConfig(themeLower);

    // Merge with existing resolve configuration
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ...themeAliases,
    };

    // Ensure proper module resolution
    config.resolve.extensions = [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
      ...(config.resolve.extensions || []),
    ];

    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Add rule to ignore non-active theme directories
    const ignoredThemes = VALID_THEMES
      .filter(t => t.toLowerCase() !== themeLower)
      .map(t => t.toLowerCase());

    config.module.rules.push({
      test: /\.(tsx?|jsx?)$/,
      exclude: ignoredThemes.map(theme =>
        new RegExp(`src/components/[^/]+/${theme}/`)
      ),
    });

    return config;
  },
};

export default nextConfig;
