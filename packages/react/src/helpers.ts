import { useRef, useEffect, MutableRefObject, MouseEvent } from "react";

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

export const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
