export default function PropFlowPreview() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      <defs>
        <linearGradient id="propflow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="#0f172a" />
      <rect x="20" y="20" width="360" height="160" fill="url(#propflow-grad)" opacity="0.1" rx="8" />
      <text x="200" y="70" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#3b82f6">
        PropFlow
      </text>
      <text x="200" y="100" textAnchor="middle" fontSize="14" fill="#cbd5e1">
        Real Estate CRM
      </text>
      <rect x="40" y="120" width="90" height="20" fill="#3b82f6" opacity="0.3" rx="4" />
      <text x="85" y="134" textAnchor="middle" fontSize="12" fill="#60a5fa">
        Leads
      </text>
      <rect x="155" y="120" width="90" height="20" fill="#3b82f6" opacity="0.3" rx="4" />
      <text x="200" y="134" textAnchor="middle" fontSize="12" fill="#60a5fa">
        Pipeline
      </text>
      <rect x="270" y="120" width="90" height="20" fill="#3b82f6" opacity="0.3" rx="4" />
      <text x="315" y="134" textAnchor="middle" fontSize="12" fill="#60a5fa">
        Follow-up
      </text>
    </svg>
  );
}
