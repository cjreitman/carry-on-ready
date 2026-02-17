const shared = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '64px',
  },
  maxWidth: '960px',
  borderRadius: '6px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

export const lightTheme = {
  ...shared,
  colorScheme: 'light',
  colors: {
    primary: '#1a73e8',
    primaryHover: '#1557b0',
    text: '#1a1a1a',
    textLight: '#555',
    bg: '#ffffff',
    bgLight: '#f7f8fa',
    border: '#e0e0e0',
    warning: '#d93025',
    warningBg: '#fce8e6',
    success: '#188038',
    successBg: '#e6f4ea',
    inputBg: '#ffffff',
  },
};

export const darkTheme = {
  ...shared,
  colorScheme: 'dark',
  colors: {
    primary: '#4da3ff',
    primaryHover: '#3b8de6',
    text: '#e0e0e0',
    textLight: '#9a9a9a',
    bg: '#0f1115',
    bgLight: '#1a1d23',
    border: '#2a2d35',
    warning: '#f28b82',
    warningBg: '#3c1f1e',
    success: '#81c995',
    successBg: '#1e3a2a',
    inputBg: '#1a1d23',
  },
};
