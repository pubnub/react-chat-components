import { useRef, useEffect } from "react";
import { FilePayload, MessagePayload } from "./types";

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

export const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export function isFilePayload(message: MessagePayload | FilePayload): message is FilePayload {
  return (message as FilePayload).file !== undefined;
}
