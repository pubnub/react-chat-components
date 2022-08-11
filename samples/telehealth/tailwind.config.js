module.exports = {
  content: ["./index.html", "./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Poppins"],
    },
    colors: {
      white: "#FFFFFF",
      red: {
        600: "#FF897A",
        700: "#DD3730",
      },
      cyan: {
        300: "#D9F2FC",
        400: "#D4ECF5",
        500: "#9ACDE1",
        600: "#99CDE1",
        700: "#4AB2D9",
      },
      slate: {
        300: "#9AB8C2",
        500: "#578291",
        700: "#33687B",
      },
      gray: {
        100: "#F4F4F4",
        200: "#E9E9E9",
        300: "#CECECE",
        400: "#B2B2B2",
        500: "#606060",
        600: "#525252",
        700: "#464646",
        800: "#383838",
        900: "#2B2B2B",
      },
      blue: {
        100: "#EAF0F6",
        500: "#89A2BC",
        600: "#7D99B5",
        900: "#6366F1",
      },
      black: "#000000",
    },
    extend: {
      borderRadius: {
        xl: "10px",
      },
      boxShadow: {
        xl: "0px 0px 24px rgba(0, 0, 0, 0.18), 4px 4px 4px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
