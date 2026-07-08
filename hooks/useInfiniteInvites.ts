import { useEffect, useState } from "react";

export function useInfiniteInvites(
  totalItems: number,
  initial = 15,
  increment = 10,
) {
  const [visibleCount, setVisibleCount] = useState(initial);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;

      if (nearBottom && visibleCount < totalItems) {
        setVisibleCount((prev) => prev + increment);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, totalItems, increment]);

  const reset = () => setVisibleCount(initial);

  return {
    visibleCount,
    reset,
  };
}
