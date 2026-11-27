import React from 'react';

export default function CodeArenaLogo({ className = 'w-8 h-8' }) {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-lg bg-[#7775EF]/30 blur-md"
      />
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative ${className}`}
        aria-hidden="true"
      >
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="8"
          fill="#101116"
          stroke="url(#caLogoBorder)"
          strokeWidth="1.4"
        />
        <path
          d="M12.2 11.2L7.4 16L12.2 20.8"
          stroke="url(#caLogoStroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.8 11.2L24.6 16L19.8 20.8"
          stroke="url(#caLogoStroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points="16,13.2 18.6,16 16,18.8 13.4,16" fill="#F5D6AE" />
        <defs>
          <linearGradient
            id="caLogoBorder"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F5D6AE" stopOpacity="0.65" />
            <stop offset="0.5" stopColor="#C4A5F5" stopOpacity="0.65" />
            <stop offset="1" stopColor="#7775EF" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient
            id="caLogoStroke"
            x1="7"
            y1="11"
            x2="25"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F5D6AE" />
            <stop offset="0.5" stopColor="#C4A5F5" />
            <stop offset="1" stopColor="#7775EF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
