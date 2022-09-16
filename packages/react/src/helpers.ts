import { useRef, useEffect, useState, MutableRefObject, MouseEvent } from "react";

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

export const useIntersectionObserver = (
  elementRef: MutableRefObject<Element>,
  observerParams?: IntersectionObserverInit
): IntersectionObserverEntry | null => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>(null);

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(updateEntry, observerParams);
    if (elementRef?.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, JSON.stringify(observerParams)]);

  return entry;
};

export const useMutationObserver = (
  elementRef: MutableRefObject<Element>,
  observerParams?: MutationObserverInit
): MutationRecord => {
  const [entry, setEntry] = useState<MutationRecord>();

  const updateEntry = ([entry]: MutationRecord[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const observer = new MutationObserver(updateEntry);
    if (elementRef?.current) observer.observe(elementRef.current, observerParams);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, JSON.stringify(observerParams)]);

  return entry;
};

export const useResizeObserver = (elementRef: MutableRefObject<Element>): ResizeObserverEntry => {
  const [entry, setEntry] = useState<ResizeObserverEntry>();

  const updateEntry = ([entry]: ResizeObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const observer = new ResizeObserver(updateEntry);
    if (elementRef?.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef]);

  return entry;
};
