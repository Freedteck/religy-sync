export const lightTheme = {
  blurs: {
    modalOverlay: "blur(0)",
  },
  backgroundColors: {
    primaryButton: "var(--accent-blue-light)",
    primaryButtonHover: "var(--accent-blue)",
    outlineButtonHover: "var(--dark-blue-5)",
    modalOverlay: "rgba(22, 27, 51, 0.8)", // var(--dark-blue-4) with opacity
    modalPrimary: "var(--dark-blue-3)",
    modalSecondary: "var(--dark-blue-5)",
    iconButton: "transparent",
    iconButtonHover: "var(--dark-blue-5)",
    dropdownMenu: "var(--dark-blue-3)",
    dropdownMenuSeparator: "var(--dark-blue-5)",
    walletItemSelected: "var(--dark-blue-5)",
    walletItemHover: "rgba(67, 97, 238, 0.15)", // var(--accent-blue-light) with opacity
  },
  borderColors: {
    outlineButton: "var(--accent-blue-light)",
  },
  colors: {
    primaryButton: "var(--text-white)",
    outlineButton: "var(--text-white)",
    iconButton: "var(--text-white)",
    body: "var(--text-white)",
    bodyMuted: "var(--text-gray)",
    bodyDanger: "var(--danger-red)",
  },
  radii: {
    small: "6px",
    medium: "8px",
    large: "12px",
    xlarge: "16px",
  },
  shadows: {
    primaryButton: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    walletItemSelected: "0px 2px 6px rgba(0, 0, 0, 0.1)",
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    bold: "600",
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "18px",
    xlarge: "20px",
  },
  typography: {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontStyle: "normal",
    lineHeight: "1.5",
    letterSpacing: "normal",
  },
};
