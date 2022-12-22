import ViewReactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

export const doAndroidHackWorkaround = () => {
  // Workaround for workaround for: https://github.com/facebook/react-native/issues/30034
  ViewReactNativeStyleAttributes.scaleY = true;
};
