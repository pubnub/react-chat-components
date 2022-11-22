import { useState, useEffect, useMemo } from "react";
import { Animated, Easing } from "react-native";
import { Themes } from "@pubnub/common-chat-components";
import { merge } from "lodash";

export interface UseStyleProps<T> {
  theme: Themes | "";
  createDefaultStyle: (theme: Themes | "") => T;
  customStyle?: T;
}

export const useStyle = <T>(props: UseStyleProps<T>): T => {
  const { theme, createDefaultStyle, customStyle } = props;
  const [style, setStyle] = useState(createDefaultStyle(theme));

  useEffect(() => {
    setStyle(merge({}, createDefaultStyle(theme), customStyle));
  }, [createDefaultStyle, setStyle, customStyle, theme]);

  return style;
};

export const useRotation = (shouldRun = true): Animated.AnimatedInterpolation<number> => {
  const [rotationValue] = useState(new Animated.Value(0));
  const animation = useMemo(
    () =>
      Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ),
    [rotationValue]
  );
  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    if (shouldRun)
      animation.start(() => {
        rotationValue.setValue(0);
      });
    else animation.reset();

    return () => {
      animation.reset();
    };
  }, [animation, rotationValue, shouldRun]);

  return rotation;
};
