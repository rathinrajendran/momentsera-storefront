import { useRef, useState, useEffect } from "react";

export function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth + 2;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      hasOverflow &&
        el.scrollLeft + el.clientWidth < el.scrollWidth - 2
    );
  };

  const scrollLeft = () =>
    ref.current?.scrollBy({ left: -260, behavior: "smooth" });

  const scrollRight = () =>
    ref.current?.scrollBy({ left: 260, behavior: "smooth" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const t = setTimeout(update, 100);

    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { ref, scrollLeft, scrollRight, canScrollLeft, canScrollRight };
}