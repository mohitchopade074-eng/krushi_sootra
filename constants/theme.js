// KRUSHI-SOOTRA (कृषी-सूत्र)
// Apple HIG Inspired Design System Tokens for Agricultural Ergonomics

export const Colors = {
  // Brand Emerald & Ambient Accents
  primary: '#059669',       // Premium Emerald (clean, modern, high-tech)
  primaryDark: '#064E3B',   // Deep Forest Emerald
  primaryLight: '#10B981',  // Radiant Neon Mint
  accentGreen: '#34D399',   // Bright Mint Glow
  mintTint: 'rgba(16, 185, 129, 0.12)',      // Translucent callout
  mintBorder: 'rgba(52, 211, 153, 0.28)',    // Subtle glass border
  
  // Luxury Glassmorphic Surfaces (Frosted Glass with Alpha)
  glassSurface: 'rgba(255, 255, 255, 0.78)',
  glassSurfaceSubtle: 'rgba(255, 255, 255, 0.55)',
  glassSurfaceElevated: 'rgba(255, 255, 255, 0.90)',
  glassBorder: 'rgba(255, 255, 255, 0.75)',
  glassBorderGlow: 'rgba(16, 185, 129, 0.35)',
  glassDarkSurface: 'rgba(15, 23, 42, 0.75)',
  glassDarkBorder: 'rgba(255, 255, 255, 0.12)',

  // Backgrounds & Canvas
  background: '#F0F3F8',    // Modern luxury cool gray-tinted canvas
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F8FAFC',

  // High-contrast Outdoor Typography
  textPrimary: '#0F172A',   // Slate 900
  textSecondary: '#475569', // Slate 600
  textTertiary: '#94A3B8',  // Slate 400
  textInverse: '#FFFFFF',

  // Status & Utility Colors
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.15)',
  info: '#0284C7',
  infoLight: 'rgba(2, 132, 199, 0.15)',

  // Structural & Lines
  border: 'rgba(226, 232, 240, 0.8)',
  borderDark: '#CBD5E1',
  divider: 'rgba(241, 245, 249, 0.8)',
  overlay: 'rgba(15, 23, 42, 0.55)',
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
