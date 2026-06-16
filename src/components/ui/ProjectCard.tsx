'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ProjectCardProps {
  name: string;
  description: string;
  tags: string[];
  status: 'Live Demo' | 'In Development' | 'In Progress' | 'Concept UI';
  button: {
    label: string;
    href: string;
  };
  children?: ReactNode;
  preview?: ReactNode;
}

const statusStyles = {
  'Live Demo':       { color: 'rgba(74,222,128,0.9)',  border: 'rgba(74,222,128,0.25)',  bg: 'rgba(74,222,128,0.06)'  },
  'In Development':  { color: 'rgba(251,191,36,0.9)',  border: 'rgba(251,191,36,0.25)',  bg: 'rgba(251,191,36,0.06)'  },
  'In Progress':     { color: 'rgba(147,197,253,0.9)', border: 'rgba(147,197,253,0.25)', bg: 'rgba(147,197,253,0.06)' },
  'Concept UI':      { color: 'rgba(216,180,254,0.9)', border: 'rgba(216,180,254,0.25)', bg: 'rgba(216,180,254,0.06)' },
};

export default function ProjectCard({ name, description, tags, status, button, children, preview }: ProjectCardProps) {
  const s = statusStyles[status];

  return (
    <div
      style={{
        flexShrink: 0,
        width: 380,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.07)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(14px)',
        background: 'rgba(255,255,255,0.025)',
        transition: 'border-color 0.3s, background 0.3s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.13)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.045)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
      }}
    >
      {/* Status badge */}
      <span style={{
        display: 'inline-block',
        marginBottom: 16,
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.05em',
        color: s.color,
        border: `1px solid ${s.border}`,
        backgroundColor: s.bg,
        width: 'fit-content',
      }}>
        {status}
      </span>

      <h3 style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: 22,
        fontWeight: 700,
        color: '#ffffff',
        marginBottom: 10,
        letterSpacing: '-0.025em',
      }}>
        {name}
      </h3>

      <p style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 13,
        lineHeight: 1.65,
        color: 'rgba(255,255,255,0.45)',
        marginBottom: 16,
      }}>
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {tags.map(tag => (
          <span key={tag} style={{
            padding: '3px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.02)',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Preview */}
      <div style={{
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(0,0,0,0.25)',
        padding: 16,
        marginBottom: 20,
        height: 192,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {preview || children || <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>{name}</span>}
      </div>

      {/* CTA */}
      <Link
        href={button.href}
        style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          marginTop: 'auto',
          padding: '11px 24px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.18)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          transition: 'background 0.2s, border-color 0.2s',
          textDecoration: 'none',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.32)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)';
        }}
      >
        {button.label}
      </Link>
    </div>
  );
}
