export const Colors = {
  primary: {
    500: 'hsl(217, 91%, 60%)', // Royal Blue
    400: 'hsl(217, 91%, 70%)',
    100: 'hsl(217, 91%, 95%)',
    900: 'hsl(217, 91%, 20%)',
  },
  secondary: {
    500: 'hsl(199, 89%, 48%)', // Ocean Blue / Cyan
    100: 'hsl(199, 89%, 95%)',
  },
  accent: {
    500: 'hsl(142, 70%, 45%)', // Emerald
    100: 'hsl(142, 70%, 95%)',
  },
  semantic: {
    success: 'hsl(142, 70%, 45%)',
    warning: 'hsl(38, 92%, 50%)',
    error: 'hsl(0, 84%, 60%)',
    info: 'hsl(199, 89%, 48%)',
  },
  light: {
    surface: 'hsl(0, 0%, 100%)',
    background: 'hsl(210, 40%, 98%)',
    textPrimary: 'hsl(222, 47%, 12%)',
    textSecondary: 'hsl(215, 16%, 47%)',
    border: 'hsl(214, 32%, 91%)',
  },
  dark: {
    surface: 'hsl(222, 47%, 11%)',
    background: 'hsl(222, 47%, 6%)',
    textPrimary: 'hsl(210, 40%, 98%)',
    textSecondary: 'hsl(215, 20%, 65%)',
    border: 'hsl(217, 32%, 17%)',
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
