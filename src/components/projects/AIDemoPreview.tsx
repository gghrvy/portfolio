export default function AIDemoPreview() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      <defs>
        <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="#0f172a" />
      <rect x="20" y="20" width="360" height="160" fill="url(#ai-grad)" opacity="0.1" rx="8" />
      <text x="200" y="60" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#10b981">
        AI Lead Follow-up
      </text>
      <text x="200" y="90" textAnchor="middle" fontSize="12" fill="#cbd5e1">
        Type a name → AI writes message
      </text>
      <rect x="60" y="110" width="280" height="50" fill="#10b981" opacity="0.15" rx="4" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="140" textAnchor="middle" fontSize="11" fill="#86efac" fontStyle="italic">
        "Hi Maria, I wanted to check in..."
      </text>
    </svg>
  );
}
