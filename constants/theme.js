// KRUSHI-SOOTRA (कृषी-सूत्र)
// Apple HIG Inspired Design System Tokens for Agricultural Ergonomics

export const Colors = {
  // Brand Greens
  primary: '#1B5E20',       // Deep Forest Green
  primaryDark: '#0E3A13',   // Shadow / active state
  primaryLight: '#2E7D32',  // Secondary green
  accentGreen: '#43A047',   // Vibrant badge / progress
  mintTint: '#E8F5E9',      // Soft callout background
  mintBorder: '#C8E6C9',    // Accent border

  // Backgrounds & Surfaces
  background: '#F7F8F7',    // Eye-friendly off-white canvas
  surface: '#FFFFFF',       // Grouped Inset Card background
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F1F3F2',  // Secondary card / chip bg

  // High-contrast Outdoors Typography
  textPrimary: '#111111',   // Deep Charcoal
  textSecondary: '#6B7280', // Slate Gray
  textTertiary: '#9CA3AF',  // Subtle placeholder / inactive
  textInverse: '#FFFFFF',   // On dark green buttons

  // Status & Utility Colors
  success: '#2E7D32',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#D32F2F',
  errorLight: '#FEE2E2',
  info: '#0284C7',
  infoLight: '#E0F2FE',

  // Structural & Lines
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  divider: '#F3F4F6',
  overlay: 'rgba(0, 0, 0, 0.45)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,    // Standard HIG card radius
  xxl: 24,   // Apple Grouped Inset Card
  pill: 999, // Badges and pill buttons
};

export const Typography = {
  sizes: {
    xs: 11,
    sm: 13,
    body: 15,
    subtitle: 17,
    title: 20,
    headline: 24,
    largeTitle: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  }
};

export const Shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#0E3A13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  prominent: {
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const Layout = {
  touchMinHeight: 56, // Apple HIG min recommended touch target for agricultural one-hand use
  screenHorizontalPadding: 16,
  cardRadius: Radii.xxl,
};
