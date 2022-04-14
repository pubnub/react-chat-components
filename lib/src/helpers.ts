import { useRef, useEffect, MutableRefObject, MouseEvent } from "react";

export const getNameInitials = (name: string): string => {
  if (!name || !name.length) return "";
  const nameSplit = name.split(" ");
  const initials =
    nameSplit.length == 1 ? nameSplit[0].substring(0, 2) : nameSplit[0][0] + nameSplit[1][0];
  return initials.toUpperCase();
};

export const getPredefinedColor = (uuid: string): string => {
  if (!uuid || !uuid.length) return;
  const colors = ["#80deea", "#9fa7df", "#aed581", "#ce93d8", "#ef9a9a", "#ffab91", "#ffe082"];
  const sum = uuid
    .split("")
    .map((c) => c.charCodeAt(0))
    .reduce((a, b) => a + b);
  return colors[sum % colors.length];
};

export const useOuterClick = (
  callback: (e: MouseEvent) => unknown
): MutableRefObject<HTMLDivElement> => {
  const callbackRef = useRef<(e: MouseEvent) => unknown>();
  const innerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handleClick = (e) => {
      if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target))
        callbackRef.current(e);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return innerRef;
};
