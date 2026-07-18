import { useCallback, useEffect, useState } from 'react';

// Sets the document title and meta description per route (client-side "head" management)
export const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description]);
};

// Fades content in once it scrolls into view. Uses a callback ref (not a plain
// ref object) so the observer attaches whenever the DOM node actually appears —
// not just on the component's first mount. Plain refs miss elements that render
// null on first pass (e.g. while data is still loading) and mount their real
// content later, since the observer setup effect never re-runs to notice the
// now-existing node, leaving isInView permanently false.
export const useInView = (threshold = 0.1) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const ref = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold]);

  return { ref, isInView };
};
