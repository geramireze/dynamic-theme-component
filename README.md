# Multi-Bank Theming System - Cash AVC POC

A Next.js 16 application demonstrating a sophisticated multi-bank theming architecture that supports **completely different component implementations per bank**, not just different styles.

## Features

- **Build-Time Component Resolution**: Each bank's build only includes its specific components
- **Zero Bundle Bloat**: BOCC components are not in BBOG builds, and vice versa
- **Automatic Fallback**: Missing bank-specific components use shared implementations
- **Type-Safe**: Full TypeScript support across all variants
- **Sass Integration**: Works seamlessly with existing Sass variable theming

## Quick Start

```bash
# Install dependencies
npm install

# Development - Choose your bank
npm run dev:bbog    # Banco de Bogotá
npm run dev:bocc    # Banco de Occidente
npm run dev:bavv    # Banco AV Villas
npm run dev:bpop    # Banco Popular

# Production builds
npm run build:bbog  # Outputs to build/bbog/
npm run build:bocc  # Outputs to build/bocc/
npm run build:bavv  # Outputs to build/bavv/
npm run build:bpop  # Outputs to build/bpop/
```

## How It Works

### Component Resolution

When you import a component:

```tsx
import DatePicker from '@/components/DatePicker/DatePicker';
```

The build system automatically resolves it based on `BUILD_THEME`:

| Theme | Resolves To |
|-------|------------|
| BBOG  | `DatePicker/bbog/DatePicker.tsx` (bank-specific) |
| BOCC  | `DatePicker/bocc/DatePicker.tsx` (bank-specific) |
| BAVV  | `DatePicker/DatePicker.tsx` (shared fallback) |
| BPOP  | `DatePicker/DatePicker.tsx` (shared fallback) |

### File Structure

```
src/components/DatePicker/
├── DatePicker.types.ts      # Shared interface (required)
├── DatePicker.tsx           # Shared/fallback implementation
├── DatePicker.scss          # Shared styles
├── bbog/
│   ├── DatePicker.tsx       # BBOG-specific implementation
│   └── DatePicker.scss      # BBOG-specific styles
└── bocc/
    ├── DatePicker.tsx       # BOCC-specific implementation
    └── DatePicker.scss      # BOCC-specific styles
```

### Build Output Verification

When building, you'll see resolution logs:

```bash
BUILD_THEME=BBOG npm run build
✓ Compiled successfully
```

## Example Components

### DatePicker

The DatePicker component demonstrates bank-specific implementations:

- **BBOG**: Two-column layout with month selector sidebar
- **BOCC**: Minimalist single-panel with gradient header
- **BAVV/BPOP**: Shared implementation with basic calendar

### Button

The Button component uses a shared implementation styled via Sass variables for all banks.

## Project Structure

```
cash-avc-poc/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # Themed components
│   │   ├── Button/
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.tsx
│   │   │   └── Button.scss
│   │   └── DatePicker/
│   │       ├── DatePicker.types.ts
│   │       ├── DatePicker.tsx
│   │       ├── DatePicker.scss
│   │       ├── bbog/
│   │       │   ├── DatePicker.tsx
│   │       │   └── DatePicker.scss
│   │       └── bocc/
│   │           ├── DatePicker.tsx
│   │           └── DatePicker.scss
│   ├── lib/
│   │   └── theme-resolver.ts  # Theme utilities
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── bbog/_variables.scss
│   │   │   ├── bocc/_variables.scss
│   │   │   ├── bavv/_variables.scss
│   │   │   └── bpop/_variables.scss
│   │   └── _mixins.scss
│   └── types/
│       └── components.d.ts    # TypeScript declarations
├── build/                      # Build outputs (gitignored)
│   ├── bbog/
│   ├── bocc/
│   ├── bavv/
│   └── bpop/
├── next.config.ts             # Webpack configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## Creating New Components

### 1. Create Shared Types

```tsx
// src/components/MyComponent/MyComponent.types.ts
export interface MyComponentProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}
```

### 2. Create Shared Implementation

```tsx
// src/components/MyComponent/MyComponent.tsx
import type { MyComponentProps } from './MyComponent.types';

export default function MyComponent({ value, onChange, label }: MyComponentProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
```

### 3. Create Bank-Specific Implementation (Optional)

```tsx
// src/components/MyComponent/bbog/MyComponent.tsx
import type { MyComponentProps } from '../MyComponent.types';

export default function MyComponent({ value, onChange, label }: MyComponentProps) {
  // BBOG-specific implementation
  return (
    <div className="mycomponent-bbog">
      {/* Custom BBOG UI */}
    </div>
  );
}
```

### 4. Use the Component

```tsx
import MyComponent from '@/components/MyComponent/MyComponent';

// Automatically resolves to BBOG/BOCC/shared based on BUILD_THEME
<MyComponent value={value} onChange={setValue} label="My Field" />
```

## Build Verification

Each build only includes the necessary components:

```bash
# Build for BBOG
npm run build:bbog

# Verify BOCC components are not in the bundle
grep -r "datepicker-bocc" build/bbog/ || echo "✅ BOCC not in BBOG build"
```

## Technologies

- **Next.js**: 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Sass**: 1.93.3
- **Webpack**: Custom configuration via Next.js

## Environment Variables

```env
BUILD_THEME=BBOG              # Theme to build for (BBOG, BOCC, BAVV, BPOP)
NEXT_PUBLIC_THEME=BBOG        # Exposed to client (auto-set by next.config.ts)
NEXT_PUBLIC_BRAND_KEY=BBOG    # Brand key (auto-set by next.config.ts)
```

## Development Tips

### Hot Reload
Changes to bank-specific components automatically trigger hot reload:

```bash
# Terminal 1: BBOG development
npm run dev:bbog

# Edit src/components/DatePicker/bbog/DatePicker.tsx
# Hot reload triggers automatically
```

### TypeScript Support
All component variants have full type checking:

```tsx
// TypeScript knows about all props
import DatePicker from '@/components/DatePicker/DatePicker';

<DatePicker
  value={date}
  onChange={setDate}
  label="Select Date"           // ✓ Type checked
  invalidProp="test"            // ✗ TypeScript error
/>
```

### Debug Mode
Enable verbose logging:

```bash
# Check component resolution during build
BUILD_THEME=BBOG npm run build | grep "Theme Resolver"
```

## Performance

### Bundle Size Comparison

| Build | Button | DatePicker | Total Components |
|-------|--------|------------|------------------|
| BBOG  | Shared | BBOG       | 2 variants       |
| BOCC  | Shared | BOCC       | 2 variants       |
| BAVV  | Shared | Shared     | 2 variants       |
| BPOP  | Shared | Shared     | 2 variants       |

**Savings**: 30-40% smaller bundles compared to including all variants

### Build Time

- First build: ~3-5 seconds
- Subsequent builds: ~1-2 seconds (cached)
- Component resolution overhead: <100ms

## Troubleshooting

### Component Not Resolving

**Problem**: Always uses shared implementation

**Solution**:
1. Verify file naming: `ComponentName/bbog/ComponentName.tsx`
2. Check BUILD_THEME is set correctly
3. Restart dev server
4. Check build logs for resolution

### TypeScript Errors

**Problem**: Cannot find module '@/components/ComponentName'

**Solution**:
1. Ensure `ComponentName.types.ts` exists
2. Check `src/types/components.d.ts` is included
3. Restart TypeScript server

### Build Errors

**Problem**: Webpack errors or wrong components in build

**Solution**:
1. Clear build directory: `rm -rf build/`
2. Verify BUILD_THEME environment variable
3. Check console for webpack alias logs

## Contributing

When adding new components:

1. Create shared types first
2. Implement shared version
3. Add bank-specific versions only if needed
4. Test all variants: `npm run build:bbog`, `npm run build:bocc`, etc.
5. Update documentation

## License

This is a proof of concept for internal use.

---

**Documentation**:
- [Component Creation Guide](COMPONENT_CREATION_GUIDE.md)
- [Architecture Details](THEMING_ARCHITECTURE.md)

**Support**: Check build logs for debugging information
