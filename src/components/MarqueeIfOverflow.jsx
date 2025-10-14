
import { useEffect, useRef, useState } from "react";

/**
 * Ping-pong marquee that only animates when content overflows.
 * - No Tailwind arbitrary utilities required
 * - Hover to pause, respects prefers-reduced-motion
 * - Speed controlled by pixels per second (pps)
 */
export default function MarqueeIfOverflow({
  text,
  className = "",
  pps = 50, // pixels per second
  fade = true,
}) {
  const boxRef = useRef(null);
  const contentRef = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [dx, setDx] = useState(0);
  const stateRef = useRef({ x: 0, dir: -1, raf: 0, last: 0, paused: false });

  // Measure overflow
  useEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return;

    const measure = () => {
      const boxW = box.clientWidth;
      const contentW = content.scrollWidth;
      const delta = Math.max(0, contentW - boxW);
      setDx(delta);
      setOverflow(delta > 0.5);
      if (delta <= 0.5) {
        stateRef.current.x = 0;
        content.style.transform = "translateX(0px)";
      }
    };

    const ready = (document.fonts?.ready ?? Promise.resolve());
    ready.finally(() => {
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(box);
      window.addEventListener("resize", measure);
      const id = setTimeout(measure, 0);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", measure);
        clearTimeout(id);
      };
    });
  }, []);

  // Animation loop
  useEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return;

    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduce) return;

    const step = (t) => {
      const s = stateRef.current;
      if (!s.last) s.last = t;
      const dt = (t - s.last) / 1000; // seconds
      s.last = t;
      if (!s.paused && overflow && dx > 0) {
        const delta = pps * dt * s.dir; // move dir: -1 left, +1 right
        s.x += delta;
        if (s.x < -dx) { s.x = -dx; s.dir = +1; }
        if (s.x > 0)   { s.x = 0;   s.dir = -1; }
        content.style.transform = `translateX(${s.x}px)`;
      }
      s.raf = requestAnimationFrame(step);
    };
    stateRef.current.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(stateRef.current.raf);
  }, [overflow, dx, pps]);

  const onMouseEnter = () => { stateRef.current.paused = true; };
  const onMouseLeave = () => { stateRef.current.paused = false; };

  return (
    <div ref={boxRef} className="relative overflow-hidden">
      <div
        ref={contentRef}
        className={`whitespace-nowrap inline-block will-change-transform ${className}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={
          fade
            ? {
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                maskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              }
            : undefined
        }
      >
        {text}
      </div>
    </div>
  );
}
