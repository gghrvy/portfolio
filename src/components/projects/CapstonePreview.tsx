export default function CapstonePreview() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      <defs>
        <linearGradient id="capstone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="#0f172a" />
      <rect x="20" y="20" width="360" height="160" fill="url(#capstone-grad)" opacity="0.1" rx="8" />
      <text x="200" y="70" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#a78bfa">
        Capstone Project
      </text>
      <text x="200" y="105" textAnchor="middle" fontSize="13" fill="#cbd5e1">
        Thesis Project (June 2026)
      </text>
      <text x="200" y="135" textAnchor="middle" fontSize="11" fill="#c4b5fd" fontStyle="italic">
        Building innovative solution for real-world problem
      </text>
    </svg>
  );
}
