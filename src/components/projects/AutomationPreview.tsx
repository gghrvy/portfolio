'use client';

export default function AutomationPreview() {
  return (
    <div className="w-full h-full bg-[#050508]/50 flex items-center justify-center p-2 relative overflow-hidden group">
      {/* Backing glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <svg viewBox="0 0 400 200" className="w-full h-full">
        <defs>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        <style>{`
          @keyframes pulse {
            0% { stroke-dashoffset: 160; }
            100% { stroke-dashoffset: 0; }
          }
          .pulse-line {
            stroke-dasharray: 20, 60;
            animation: pulse 3s linear infinite;
          }
          .pulse-line-delay {
            stroke-dasharray: 20, 60;
            animation: pulse 3s linear infinite;
            animation-delay: 1.5s;
          }
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(245,158,11,0.3)); }
            50% { filter: drop-shadow(0 0 8px rgba(245,158,11,0.6)); }
          }
          @keyframes aiGlow {
            0%, 100% { filter: drop-shadow(0 0 2px rgba(168,85,247,0.3)); }
            50% { filter: drop-shadow(0 0 8px rgba(168,85,247,0.6)); }
          }
          .node-webhook { animation: glow 3s ease-in-out infinite; }
          .node-ai { animation: aiGlow 3s ease-in-out infinite; animation-delay: 1s; }
          .node-delivery { animation: glow 3s ease-in-out infinite; animation-delay: 2s; }
        `}</style>

        {/* Connection Lines (Static background paths) */}
        <path d="M 80 100 Q 140 60 200 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <path d="M 200 100 Q 260 140 320 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />

        {/* Glowing Pulse lines */}
        <path d="M 80 100 Q 140 60 200 100" fill="none" stroke="url(#line-grad-1)" strokeWidth="3" className="pulse-line" />
        <path d="M 200 100 Q 260 140 320 100" fill="none" stroke="url(#line-grad-1)" strokeWidth="3" className="pulse-line-delay" />

        {/* Node 1: Webhook (Lead Ingestion) */}
        <g className="node-webhook">
          <circle cx="80" cy="100" r="22" fill="#0f172a" stroke="url(#node-grad)" strokeWidth="2.5" />
          <path d="M 72 100 L 88 100 M 80 92 L 80 108 M 75 95 L 85 105 M 75 105 L 85 95" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <text x="80" y="142" textAnchor="middle" fontSize="10" fontWeight="600" fill="#94a3b8">Webhook Lead</text>
        </g>

        {/* Node 2: AI Agent (Processing) */}
        <g className="node-ai">
          <circle cx="200" cy="100" r="26" fill="#0f172a" stroke="url(#ai-grad)" strokeWidth="3" />
          <path d="M 194 100 Q 200 100 200 94 Q 200 100 206 100 Q 200 100 200 106 Q 200 100 194 100 Z" fill="#c084fc" />
          <path d="M 204 92 Q 207 92 207 89 Q 207 92 210 92 Q 207 92 207 95 Q 207 92 204 92 Z" fill="#a855f7" />
          <text x="200" y="146" textAnchor="middle" fontSize="10" fontWeight="700" fill="#c084fc">AI Qualifier</text>
        </g>

        {/* Node 3: SMS & Email Delivery (Automated action) */}
        <g className="node-delivery">
          <circle cx="320" cy="100" r="22" fill="#0f172a" stroke="url(#node-grad)" strokeWidth="2.5" />
          <path d="M 310 93 L 330 93 L 330 107 L 310 107 Z M 310 93 L 320 100 L 330 93" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="320" y="142" textAnchor="middle" fontSize="10" fontWeight="600" fill="#94a3b8">SMS Alert</text>
        </g>
      </svg>
    </div>
  );
}
