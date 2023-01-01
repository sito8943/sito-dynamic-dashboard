import { createTheme } from "@mui/material/styles";

import darkScrollbar from "./scroll";

const light = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#fbb03b",
      light: "#fbbf62",
      dark: "#af7b29",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#338dc9",
      light: "#0071bc",
      dark: "#004f83",
      contrastText: "#ffffff",
    },
    disabled: {
      dark: "#9a9a9a",
      main: "#c3c3c3",
      light: "#e3e3e3",
    },
    background: {
      default: "#fafafa",
      paper: "aliceblue",
      button: "#f5efef",
      paper2: "#f5efef",
    },
    text: {
      main: "#272F40",
      primary: "rgba(0,0,0,0.87)",
      secondary: "rgba(0,0,0,0.54)",
      disabled: "rgba(0,0,0,0.38)",
      hint: "rgba(0,0,0,0.38)",
    },
    side: {
      main: "rgba(0,0,0,0.54)",
    },
    error: {
      main: "#f44336",
      light: "#f6685e",
      dark: "#aa2e25",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      light: "#ffac33",
      dark: "#b26a00",
      contrastText: "rgba(0,0,0,0.87)",
    },
    info: {
      main: "#2196f3",
      light: "#4dabf5",
      dark: "#1769aa",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#6fbf73",
      dark: "#357a38",
      contrastText: "rgba(0,0,0,0.87)",
    },
    divider: "rgba(0,0,0,0.12)",
  },
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    htmlFontSize: 16,
    h1: {
      fontSize: "6rem",
      fontWeight: "bold",
      lineHeight: 1.16,
      letterSpacing: "-0.01em",
      fontFamily: "Times New Roman, Times, serif",
    },
    h2: {
      fontSize: "3.7rem",
      fontWeight: "bold",
      lineHeight: 1.2,
      letterSpacing: "0.01em",
      fontFamily: "Times New Roman, Times, serif",
    },
    h3: {
      fontSize: "3rem",
      fontWeight: "bold",
      lineHeight: 1.16,
      letterSpacing: "0em",
      fontFamily: "Times New Roman, Times, serif",
    },
    h4: {
      fontSize: "2.1rem",
      fontWeight: "bold",
      lineHeight: 1.23,
      letterSpacing: "0.02em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: "0em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    h6: {
      fontSize: "1.3rem",
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: "0.02em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: "0.01em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    subtitle2: {
      fontSize: "0.8rem",
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.01em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.01em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    body2: {
      fontSize: "0.8rem",
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: "0.01em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    button: {
      textTransform: "capitalize",
      fontSize: "0.8rem",
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: "0.02em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    caption: {
      fontSize: "0.8rem",
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: "0.03em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    overline: {
      fontSize: "0.8rem",
      fontWeight: 400,
      lineHeight: 2.66,
      letterSpacing: "0.08em",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar({ track: "#FFFFFF00", thumb: "#bdbbbb", active: "#bdbbbb" }),
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      message: {
        marginTop: "3px",
      },
    },
  },
});

export default light;
