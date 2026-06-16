'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import {
  SiNextdotjs, SiReact, SiTypescript, SiJavascript, SiHtml5,
  SiPhp, SiLaravel, SiNodedotjs,
  SiMysql, SiPostgresql, SiFirebase,
  SiThreedotjs, SiMapbox,
  SiFigma, SiGit, SiGithub,
  SiTailwindcss, SiGsap, SiRailway,
} from 'react-icons/si';

const TECHS = [
  { name: 'Next.js',    color: '#ffffff', Icon: SiNextdotjs   },
  { name: 'React',      color: '#61dafb', Icon: SiReact       },
  { name: 'TypeScript', color: '#3178c6', Icon: SiTypescript  },
  { name: 'JavaScript', color: '#f7df1e', Icon: SiJavascript  },
  { name: 'HTML5',      color: '#e34f26', Icon: SiHtml5       },
  { name: 'Tailwind',   color: '#06b6d4', Icon: SiTailwindcss },
  { name: 'GSAP',       color: '#88ce02', Icon: SiGsap        },
  { name: 'Three.js',   color: '#ffffff', Icon: SiThreedotjs  },
  { name: 'PHP',        color: '#777bb4', Icon: SiPhp         },
  { name: 'Laravel',    color: '#ff2d20', Icon: SiLaravel     },
  { name: 'Node.js',    color: '#339933', Icon: SiNodedotjs   },
  { name: 'MySQL',      color: '#4479a1', Icon: SiMysql       },
  { name: 'PostgreSQL', color: '#4169e1', Icon: SiPostgresql  },
  { name: 'Firebase',   color: '#ffca28', Icon: SiFirebase    },
  { name: 'Mapbox GL',  color: '#4264fb', Icon: SiMapbox      },
  { name: 'Railway',    color: '#ffffff', Icon: SiRailway     },
  { name: 'Figma',      color: '#f24e1e', Icon: SiFigma       },
  { name: 'Git',        color: '#f05032', Icon: SiGit         },
  { name: 'GitHub',     color: '#ffffff', Icon: SiGithub      },
];

const CARD  = 80;   // card size px
const PAD   = 20;   // padding around field
const REPEL = 120;  // mouse repel radius
const CONN  = 180;  // line connection max distance

type Node = {
  x: number; y: number;
  vx: number; vy: number;
  ox: number; oy: number; // origin (home)
  phase: number;
  idx: number;
};

export default function TechStack() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<Node[]>([]);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef(0);
  const cardsRef  = useRef<HTMLDivElement[]>([]);
  const hoveredRef = useRef<number | null>(null);

  /* Build grid positions on mount / resize */
  const buildNodes = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const W = wrap.clientWidth;
    const cols = Math.floor((W - PAD * 2) / (CARD + 12));
    const cw   = (W - PAD * 2) / cols;

    nodesRef.current = TECHS.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const ox  = PAD + col * cw + cw / 2;
      const oy  = PAD + row * (CARD + 20) + CARD / 2;
      return { x: ox, y: oy, vx: 0, vy: 0, ox, oy, phase: i * 0.7, idx: i };
    });
  }, []);

  /* Animation loop */
  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) { rafRef.current = requestAnimationFrame(tick); return; }

    const ctx  = canvas.getContext('2d')!;
    const W    = canvas.width;
    const H    = canvas.height;
    const t    = performance.now() / 1000;
    const mx   = mouseRef.current.x;
    const my   = mouseRef.current.y;
    const nodes = nodesRef.current;

    ctx.clearRect(0, 0, W, H);

    /* Update positions */
    nodes.forEach(n => {
      // Gentle float around home
      const floatX = Math.sin(t * 0.4 + n.phase)       * 8;
      const floatY = Math.cos(t * 0.35 + n.phase * 1.3) * 6;
      const targetX = n.ox + floatX;
      const targetY = n.oy + floatY;

      // Mouse repulsion
      const dx = n.x - mx;
      const dy = n.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let rx = 0, ry = 0;
      if (dist < REPEL && dist > 0) {
        const force = (REPEL - dist) / REPEL;
        rx = (dx / dist) * force * 40;
        ry = (dy / dist) * force * 40;
      }

      n.x += (targetX + rx - n.x) * 0.08;
      n.y += (targetY + ry - n.y) * 0.08;

      // Move DOM card
      const card = cardsRef.current[n.idx];
      if (card) {
        card.style.left = `${n.x - CARD / 2}px`;
        card.style.top  = `${n.y - CARD / 2}px`;
      }
    });

    /* Draw connection lines */
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i) return;
        const dx   = a.x - b.x;
        const dy   = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > CONN) return;

        const isHovA = hoveredRef.current === i;
        const isHovB = hoveredRef.current === j;
        const alpha  = (1 - dist / CONN) * (isHovA || isHovB ? 0.55 : 0.12);

        const color = isHovA
          ? TECHS[i].color
          : isHovB
          ? TECHS[j].color
          : 'rgba(255,255,255,1)';

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = color === 'rgba(255,255,255,1)'
          ? `rgba(255,255,255,${alpha})`
          : hexToRgba(color, alpha);
        ctx.lineWidth = isHovA || isHovB ? 1 : 0.5;
        ctx.stroke();
      });
    });

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    buildNodes();

    const wrap = wrapRef.current;
    if (!wrap) return;

    // Size canvas to wrap
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !wrap) return;
      canvas.width  = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      buildNodes();
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking relative to wrap
    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    wrap.addEventListener('mousemove', onMove, { passive: true });
    wrap.addEventListener('mouseleave', onLeave);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [buildNodes, tick]);

  const [containerH, setContainerH] = useState(PAD * 2 + Math.ceil(TECHS.length / 8) * (CARD + 20));

  useEffect(() => {
    const calc = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const cols = Math.max(1, Math.floor((wrap.clientWidth - PAD * 2) / (CARD + 12)));
      const rows = Math.ceil(TECHS.length / cols);
      setContainerH(PAD * 2 + rows * (CARD + 20));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', width: '100%', height: containerH, minHeight: 320 }}
    >
      {/* Connection lines canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Icon cards */}
      {TECHS.map(({ name, color, Icon }, i) => (
        <div
          key={name}
          ref={el => { if (el) cardsRef.current[i] = el; }}
          data-cursor-hover
          onMouseEnter={() => { hoveredRef.current = i; }}
          onMouseLeave={() => { hoveredRef.current = null; }}
          style={{
            position: 'absolute',
            width: CARD, height: CARD,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            background: 'rgba(5,5,8,0.6)',
            backdropFilter: 'blur(8px)',
            cursor: 'none',
            transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
            userSelect: 'none',
          }}
          onMouseOver={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = `${color}55`;
            el.style.boxShadow   = `0 0 24px ${color}22, 0 0 8px ${color}11`;
            el.style.background  = 'rgba(5,5,8,0.85)';
          }}
          onMouseOut={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(255,255,255,0.08)';
            el.style.boxShadow   = 'none';
            el.style.background  = 'rgba(5,5,8,0.6)';
          }}
        >
          <Icon size={26} style={{ color, filter: `drop-shadow(0 0 5px ${color}66)`, flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 7.5, letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center', lineHeight: 1.2,
          }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
