'use client';

import { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge: {
    text: string;
    color: 'green' | 'amber' | 'blue';
  };
}

const badgeStyles = {
  green: { color: 'rgba(74,222,128,0.9)', border: 'rgba(74,222,128,0.25)', bg: 'rgba(74,222,128,0.06)' },
  amber: { color: 'rgba(251,191,36,0.9)', border: 'rgba(251,191,36,0.25)', bg: 'rgba(251,191,36,0.06)' },
  blue:  { color: 'rgba(147,197,253,0.9)', border: 'rgba(147,197,253,0.25)', bg: 'rgba(147,197,253,0.06)' },
};

export default function ServiceCard({ icon, title, description, badge }: ServiceCardProps) {
  const b = badgeStyles[badge.color];

  return (
    <div
      data-scroll
      style={{
        position: 'relative',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.02)',
        transition: 'border-color 0.3s, background 0.3s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
      }}
    >
      <div style={{ marginBottom: 20, opacity: 0.7 }}>{icon}</div>

      <h3 style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: '#ffffff',
        marginBottom: 12,
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h3>

      <p style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13,
        lineHeight: 1.7,
        color: 'rgba(255,255,255,0.45)',
        flexGrow: 1,
        marginBottom: 20,
      }}>
        {description}
      </p>

      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.05em',
        color: b.color,
        border: `1px solid ${b.border}`,
        backgroundColor: b.bg,
        width: 'fit-content',
      }}>
        {badge.text}
      </span>
    </div>
  );
}
