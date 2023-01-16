/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "0",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      red: "#ef4444",
      blood: "#222333",
      dodger: "#1e90ff",
      white: "#ffffff",
      black: "#000000",
      sidebar: "#020817",
      "dark-blood": "#050914",
      "dark-dodger": "#0e4881",
    },
    extend: {
      borderRadius: {
        "20px": "20px",
        circle: "100%",
      },
      width: {
        "app-name": "200px",
        full: "100%",
        viewport: "100vw",
        icon: "35px",
      },
      height: {
        icon: "35px",
        full: "100%",
        viewport: "100vh",
      },
      padding: {
        icon: "2px 2px 0 0",
        active: "5px 15px",
        pc: "40px 10rem",
        mobil: "40px",
      },
      fontWeight: {
        h1: "bold",
        h2: "bold",
        h3: "400",
        h4: "400",
        h5: "400",
      },
      fontSize: {
        "h1-lg": "6rem",
        "h1-xs": "3rem",
        h2: "3.75rem",
        h3: "3rem",
        h4: "2.125rem",
        h5: "1.5rem",
      },
    },
  },
  plugins: [],
};
