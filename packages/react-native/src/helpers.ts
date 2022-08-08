import { useState, useEffect } from "react";
import { Themes } from "chat-components-common";

export interface UseStylesProps<T> {
  theme: Themes | "";
  createDefaultStyles: (theme: Themes | "") => T;
  customStyles?: T;
}

export const useStyles = <T>(props: UseStylesProps<T>): T => {
  const { theme, createDefaultStyles, customStyles } = props;
  const [styles, setStyles] = useState(createDefaultStyles(theme));

  useEffect(() => {
    setStyles(Object.assign({}, createDefaultStyles(theme), customStyles));
  }, [createDefaultStyles, setStyles, customStyles, theme]);

  return styles;
};
