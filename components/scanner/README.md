# Scanner Components

This directory contains all reusable components for the scanner feature.

## Components

### Core Components

#### `ScannerHeader`

Header component with login toggle and history access.

**Props:**

- `isLoggedIn: boolean` - Current login state
- `onToggleLogin: (checked: boolean) => void` - Login toggle handler
- `onShowHistory: () => void` - History button click handler

#### `ScannerUploadArea`

Upload interface supporting both file upload and URL input.

**Props:**

- `activeTab: string` - Current active tab ("upload" | "url")
- `onTabChange: (value: string) => void` - Tab change handler
- `imageUrl: string` - Current image URL input
- `onImageUrlChange: (url: string) => void` - URL input change handler
- `onUrlSubmit: () => void` - URL submission handler
- `onFileInputClick: () => void` - File input trigger
- `apiReady: boolean` - API availability status
- `showTips: boolean` - Tips visibility state
- `onToggleTips: () => void` - Tips toggle handler

#### `ScannerPreview`

Image preview with integrated loading overlay.

**Props:**

- `previewImage: string` - Image source URL
- `isScanning: boolean` - Loading state
- `scanStage: string` - Current scanning stage message
- `scanProgress: number` - Progress percentage (0-100)

#### `ScannerResultDisplay`

Comprehensive results display with tabs for different information types.

**Props:**

- `scanResult: Species | null` - Basic scan result data
- `enhancedSpeciesData: EnhancedSpeciesData | null` - Detailed species information

#### `ScannerActionButtons`

Action controls for scan operations.

**Props:**

- `onReset: () => void` - Reset scan handler
- `onRescan: () => void` - Rescan handler
- `isScanning: boolean` - Current scanning state

### Utility Components

#### `ScannerConfetti`

Animated confetti effect for successful scans.

**Props:**

- `isVisible: boolean` - Visibility state

#### `ScannerLoadingOverlay`

Standalone loading overlay component.

**Props:**

- `isVisible: boolean` - Visibility state
- `scanStage: string` - Loading message
- `scanProgress: number` - Progress percentage

## Usage

```tsx
import {
  ScannerHeader,
  ScannerUploadArea,
  ScannerPreview,
  ScannerResultDisplay,
  ScannerActionButtons,
  ScannerConfetti,
} from "@/components/scanner"

// Use individual components as needed
```

## Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Components work together through props
3. **Type Safety**: All props are properly typed with TypeScript
4. **Accessibility**: Components follow accessibility best practices
5. **Responsive Design**: Components work on all screen sizes
