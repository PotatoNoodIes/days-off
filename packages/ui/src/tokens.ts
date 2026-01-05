export const Colors = {
  primary: {
    500: 'hsl(250, 80%, 60%)', // Vibrant Indigo
    400: 'hsl(250, 80%, 70%)',
    100: 'hsl(250, 80%, 96%)',
  },
  secondary: {
    500: 'hsl(180, 70%, 45%)', // Teal
    100: 'hsl(180, 70%, 95%)',
  },
  semantic: {
    success: 'hsl(150, 60%, 45%)',
    warning: 'hsl(35, 90%, 60%)',
    error: 'hsl(0, 75%, 60%)',
    info: 'hsl(210, 80%, 60%)',
  },
  neutral: {
    surface: 'hsl(0, 0%, 100%)',
    background: 'hsl(240, 10%, 98%)',
    textPrimary: 'hsl(240, 20%, 15%)',
    textSecondary: 'hsl(240, 10%, 45%)',
    border: 'hsl(240, 10%, 90%)',
  },
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const Typography = {
  heading1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  heading2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  heading3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
