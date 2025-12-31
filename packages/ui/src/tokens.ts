export const Colors = {
  primary: {
    500: 'hsl(250, 80%, 60%)', // Vibrant Indigo
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
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  heading1: { fontSize: 32, fontWeight: '700' as const },
  heading2: { fontSize: 24, fontWeight: '600' as const },
  heading3: { fontSize: 18, fontWeight: '600' as const },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const },
  bodyMedium: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
};
