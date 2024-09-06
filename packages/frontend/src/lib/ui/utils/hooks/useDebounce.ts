import { useCallback, useEffect, useRef, useState } from "react";

export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export const useDebouncedCallback = <T>(
  callback: (args: T) => void,
  delay: number,
) => {
  const timer = useRef<NodeJS.Timeout>();

  return useCallback(
    (args: T) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        callback(args);
      }, delay);
    },
    [callback, delay],
  );
};

export default useDebouncedCallback;
