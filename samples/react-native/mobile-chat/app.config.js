import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export default {
  name: "mobile-chat",
  slug: "mobile-chat",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    REACT_APP_PUB_KEY: process.env.REACT_APP_PUB_KEY,
    REACT_APP_SUB_KEY: process.env.REACT_APP_SUB_KEY,
  },
};
