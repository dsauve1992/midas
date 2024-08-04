import { useCallback, useEffect, useMemo, useState } from "react";

export function useSelection<T>(collection: T[]) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const next = useCallback(() => {
    if (currentIndex < collection.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, collection]);

  const previous = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        previous();
      } else if (event.key === "ArrowRight") {
        next();
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, previous]);

  const selection = useMemo(
    () => collection[currentIndex],
    [currentIndex, collection],
  );

  return selection;
}
