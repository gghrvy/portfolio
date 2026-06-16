'use client';

import { useEffect, useRef, useState } from 'react';

const MONO: React.CSSProperties = {
  fontFamily: "'Space Mono', 'JetBrains Mono', 'Courier New', monospace",
  fontSize: 10,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.22)',
  lineHeight: 1.8,
  userSelect: 'none',
};

const LABEL: React.CSSProperties = {
  ...MONO,
  color: 'rgba(79,142,247,0.5)',
  fontSize: 9,
};

function useHUD() {
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [time, setTime] = useState('00:00:00');
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const onMove = (e: MouseEvent) => { setCx(e.clientX); setCy(e.clientY); };
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(h > 0 ? Math.round((window.scrollY / h) * 100) : 0);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll);

    const tick = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hh}:${mm}:${ss}`);
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      clearInterval(tick);
    };
  }, []);

  return { cx, cy, scroll, time, elapsed };
}

function pad(n: number, len = 4) {
  return String(n).padStart(len, '0');
}

export default function HeroHUD() {
  const { cx, cy, scroll, time, elapsed } = useHUD();

  return (
    <>
      {/* ── Top-left: status ── */}
      <div style={{
        position: 'absolute', top: 28, left: 32, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 2,
        pointerEvents: 'none',
      }}>
        <div style={LABEL}>Status</div>
        <div style={{ ...MONO, color: '#4ade80', fontSize: 11 }}>
          ● Available for work
        </div>
        <div style={MONO}>Cebu, Philippines</div>
      </div>

      {/* ── Top-right: time ── */}
      <div style={{
        position: 'absolute', top: 28, right: 32, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
        pointerEvents: 'none',
      }}>
        <div style={LABEL}>Local Time</div>
        <div style={{ ...MONO, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{time}</div>
        <div style={MONO}>Session {pad(elapsed)}s</div>
      </div>

      {/* ── Bottom-right: cursor ── */}
      <div style={{
        position: 'absolute', bottom: 32, right: 32, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
        pointerEvents: 'none',
      }}>
        <div style={LABEL}>Cursor</div>
        <div style={MONO}>X {pad(cx)} · Y {pad(cy)}</div>
        <div style={MONO}>Scroll {String(scroll).padStart(3, '0')}%</div>
      </div>

      {/* ── Bottom-left: stack ── */}
      <div style={{
        position: 'absolute', bottom: 32, left: 32, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 2,
        pointerEvents: 'none',
      }}>
        <div style={LABEL}>Stack</div>
        <div style={MONO}>Next.js · TypeScript · Supabase</div>
        <div style={MONO}>Three.js · GSAP · AI Integration</div>
      </div>
    </>
  );
}
