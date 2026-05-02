import { useEffect, useRef } from "react";

export function useInfiniteScroll(callback, hasMore) {
  const ref = useRef(null);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callback();
      },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => el && observer.unobserve(el);
  }, [callback, hasMore]);

  return ref;
}
