module.exports = {
  content: ["./index.html", "./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Poppins"],
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      red: "#D82E20",
      ocean: {
        600: "#6767E0",
        800: "#3E3EB1",
      },
      gray: {
        100: "#F8F8FC",
        200: "#F1F1F8",
        300: "#F7F7F8",
        400: "#EFEFF1",
        500: "#B4B4B4",
        600: "#7F7F7F",
        700: "#646464",
      },
      navy: {
        600: "#4A4A61",
        700: "#2A2A39",
        800: "#232333",
        900: "#1C1C28",
      },
    },
    extend: {
      boxShadow: {
        xl: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
