import { useEffect, useRef, useState } from 'react';

export default function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'pending' | 'visible'>('idle');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || !('IntersectionObserver' in window)) {
      setState('visible');
      return;
    }
    let frame = 0;
    setState('pending');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        frame = window.requestAnimationFrame(() => setState('visible'));
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    const revealForReducedMotion = () => {
      if (media.matches) { setState('visible'); observer.disconnect(); }
    };
    media.addEventListener('change', revealForReducedMotion);
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      media.removeEventListener('change', revealForReducedMotion);
    };
  }, []);

  return { ref, state };
}
