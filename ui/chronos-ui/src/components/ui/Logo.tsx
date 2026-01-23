// Simple version for quick implementation
export const SimpleChronosLogo = ({ size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <defs>
      <linearGradient id="simpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    
    <circle cx="20" cy="20" r="18" fill="url(#simpleGradient)" opacity="0.1" />
    
    {/* Hourglass shape */}
    <path 
      d="M12,10 L28,10 L30,16 L10,16 Z M10,24 L30,24 L28,30 L12,30 Z M20,16 L20,24"
      fill="none"
      stroke="url(#simpleGradient)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Dot in the middle representing data */}
    <circle cx="20" cy="20" r="3" fill="#F59E0B" />
  </svg>
);