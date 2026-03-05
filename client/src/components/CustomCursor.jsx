import { useEffect, useRef, useState } from 'react';

// Detect touch device
const isTouchDevice = () => {
  if (typeof window === 'undefined') return true;
  // Check screen width — disable on anything under 1024px
  if (window.innerWidth < 1024) return true;
  // Check actual touch support
  if ('ontouchstart' in window) return true;
  if (navigator.maxTouchPoints > 0) return true;
  return false;
};

export default function CustomCursor() {
  // Don't render at all on touch devices
  if (isTouchDevice()) return null;

  return <DesktopCursor />;
}

function DesktopCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const pos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const trails = useRef(Array(8).fill(null).map(() => ({ x: -200, y: -200 })));
  const trailIdx = useRef(0);
  const rafRef = useRef(null);
  const stateRef = useRef({ hovered: false, clicked: false, hidden: true });

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      stateRef.current.hidden = false;
    };
    const onDown = () => { stateRef.current.clicked = true; };
    const onUp = () => { stateRef.current.clicked = false; };
    const onLeave = () => { stateRef.current.hidden = true; };
    const onEnter = () => { stateRef.current.hidden = false; };

    const onHoverStart = () => { stateRef.current.hovered = true; };
    const onHoverEnd = () => { stateRef.current.hovered = false; };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    const updateInteractives = () => {
      document.querySelectorAll('button, a, input, textarea, select, [role="button"]')
        .forEach(el => {
          el.addEventListener('mouseenter', onHoverStart);
          el.addEventListener('mouseleave', onHoverEnd);
        });
    };
    updateInteractives();

    const animate = () => {
      const { hovered, clicked, hidden } = stateRef.current;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
        dotRef.current.style.opacity = hidden ? '0' : '1';
      }

      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.13;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.13;

      if (ringRef.current) {
        const size = hovered ? 44 : 28;
        ringRef.current.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px) scale(${clicked ? 0.85 : 1})`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.opacity = hidden ? '0' : '1';
        ringRef.current.style.borderColor = hovered ? 'rgba(99,102,241,0.9)' : 'rgba(255,255,255,0.35)';
        ringRef.current.style.backgroundColor = hovered ? 'rgba(99,102,241,0.08)' : 'transparent';
      }

      trails.current[trailIdx.current] = { ...pos.current };
      trailIdx.current = (trailIdx.current + 1) % trails.current.length;

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const idx = (trailIdx.current - 1 - i + trails.current.length) % trails.current.length;
        const t = trails.current[idx];
        const age = (i + 1) / trails.current.length;
        el.style.transform = `translate(${t.x - 3}px, ${t.y - 3}px)`;
        el.style.opacity = hidden ? '0' : `${(1 - age) * 0.3}`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  const base = {
    position: 'fixed',
    top: 0, left: 0,
    pointerEvents: 'none',
    userSelect: 'none',
    willChange: 'transform',
    zIndex: 99999,
  };

  return (
    <>
      <style>{`@media (hover: hover) and (pointer: fine) { * { cursor: none !important; } }`}</style>

      <div ref={dotRef} style={{
        ...base,
        width: 8, height: 8,
        borderRadius: '50%',
        background: 'white',
        mixBlendMode: 'difference',
        transition: 'opacity 0.2s',
      }} />

      <div ref={ringRef} style={{
        ...base,
        width: 28, height: 28,
        borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.35)',
        transition: 'border-color 0.2s, background-color 0.2s, width 0.15s, height 0.15s, opacity 0.2s',
        zIndex: 99998,
      }} />

      {Array(8).fill(null).map((_, i) => (
        <div
          key={i}
          ref={el => trailRefs.current[i] = el}
          style={{
            ...base,
            width: 6, height: 6,
            borderRadius: '50%',
            background: `hsl(${240 + i * 12}, 80%, 70%)`,
            zIndex: 99997 - i,
            transition: 'opacity 0.08s',
          }}
        />
      ))}
    </>
  );
}
