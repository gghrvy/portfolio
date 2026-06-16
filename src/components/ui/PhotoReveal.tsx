'use client';

import { useRef, useCallback, useEffect } from 'react';

interface PhotoRevealProps {
  basePhoto: string;
  revealPhoto: string;
  alt: string;
  revealSize?: number;
}

export default function PhotoReveal({ basePhoto, revealPhoto, alt, revealSize = 170 }: PhotoRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const posRef       = useRef({ x: 50, y: 50 });
  const rafRef       = useRef(0);
  const activeRef    = useRef(false);

  const applyClip = useCallback(() => {
    if (!overlayRef.current) return;
    const r = activeRef.current ? revealSize / 2 : 0;
    overlayRef.current.style.clipPath = `circle(${r}px at ${posRef.current.x}% ${posRef.current.y}%)`;
  }, [revealSize]);

  const onMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    posRef.current = {
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(applyClip);
  }, [applyClip]);

  const onEnter = useCallback(() => {
    activeRef.current = true;
    if (overlayRef.current) overlayRef.current.style.transition = 'clip-path 0.06s linear';
    applyClip();
  }, [applyClip]);

  const onLeave = useCallback(() => {
    activeRef.current = false;
    if (overlayRef.current) overlayRef.current.style.transition = 'clip-path 0.5s ease';
    applyClip();
  }, [applyClip]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove',  onMove,  { passive: true });
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onMove, onEnter, onLeave]);

  return (
    <div
      ref={containerRef}
      data-cursor-hover
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit', cursor: 'none' }}
    >
      {/* Base photo */}
      <img
        src={basePhoto}
        alt={alt}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'top center', display: 'block',
          imageRendering: 'auto',
        }}
      />

      {/* Reveal layer — clip-path only, no contain/isolation to preserve sharpness */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute', inset: 0,
          clipPath: 'circle(0px at 50% 50%)',
        }}
      >
        <img
          src={revealPhoto}
          alt={`${alt} — alternate`}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center', display: 'block',
            imageRendering: 'auto',
          }}
        />
      </div>

      {/* Bottom vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,8,0.55) 0%, transparent 45%)', pointerEvents: 'none' }} />

      {/* Hint */}
      <div style={{ position: 'absolute', bottom: 14, left: 14, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', pointerEvents: 'none' }}>
        Hover ↗
      </div>
    </div>
  );
}
