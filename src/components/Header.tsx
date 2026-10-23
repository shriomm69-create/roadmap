import React from 'react';
import type { StudentProfile } from '../types/index.ts';

export type ActiveTab =
  | 'mapskills'
  | 'btech-roadmap'
  | 'quiz-zone'
  | 'skill-gap'
  | 'readiness'
  | 'projects';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedSkillsCount: number;
  profile: StudentProfile;
  readinessPct: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  savedSkillsCount,
  profile,
  readinessPct,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs: { id: ActiveTab; label: string; badge?: string }[] = [
    { id: 'mapskills', label: 'Skillify Roadmap' },
    { id: 'btech-roadmap', label: 'B.Tech Roadmap' },
    { id: 'quiz-zone', label: 'Quiz Zone' },
    { id: 'skill-gap', label: 'Skill Gaps' },
    { id: 'readiness', label: 'Placement Readiness', badge: `${readinessPct}%` },
    { id: 'projects', label: 'Projects & Resume' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#07050D]/90 border-b border-[#2B2052] transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('mapskills')}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A1035] via-[#150F2B] to-[#0A0618] border border-[#7C3AED]/60 flex items-center justify-center shadow-lg shadow-[#7C3AED]/30 group-hover:border-[#A78BFA] transition-all relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/20 to-[#E879F9]/20 opacity-80 group-hover:opacity-100 transition-opacity" />
              <svg
                viewBox="0 0 32 32"
                className="w-6 h-6 relative z-10 drop-shadow-[0_2px_8px_rgba(124,58,237,0.5)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="skillifyLogoGrad" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#5EEAD4" />
                    <stop offset="45%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#E879F9" />
                  </linearGradient>
                  <filter id="skillifyLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Flowing 'S' roadmap path */}
                <path
                  d="M23 7.5C18 7.5 10 9 9 14.5C8 20 23 18.5 23 24C23 28 17 28.5 9 27"
                  stroke="url(#skillifyLogoGrad)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Micro-dashed path accent */}
                <path
                  d="M23 7.5C18 7.5 10 9 9 14.5C8 20 23 18.5 23 24C23 28 17 28.5 9 27"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeDasharray="2 3"
                  opacity="0.7"
                />
                {/* Start milestone node */}
                <circle cx="23" cy="7.5" r="2.5" fill="#5EEAD4" />
                <circle cx="23" cy="7.5" r="1.1" fill="#07050D" />
                {/* Mid pivot milestone node */}
                <circle cx="16" cy="16.5" r="2.2" fill="#A78BFA" />
                <circle cx="16" cy="16.5" r="1" fill="#07050D" />
                {/* Target milestone node with glow */}
                <circle cx="9" cy="27" r="3" fill="#E879F9" filter="url(#skillifyLogoGlow)" />
                <circle cx="9" cy="27" r="1.3" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-[#A78BFA] to-[#E879F9] bg-clip-text text-transparent group-hover:opacity-90">
                Skillify
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#150F2B] text-[#A78BFA] border border-[#2B2052]">
                B.Tech Edition
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex desktop-nav items-center gap-1.5" aria-label="Main Navigation">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#150F2B] text-white border border-[#A78BFA] shadow-sm shadow-[#7C3AED]/20'
                    : 'text-[#A096C8] hover:text-[#F1ECFF] hover:bg-[#100B20] border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-[#7C3AED]/30 text-[#5EEAD4] border border-[#5EEAD4]/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Pill / Status */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#100B20] border border-[#2B2052] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse"></span>
            <span className="text-[#A096C8]">
              Year {profile.year} · <span className="text-white font-medium">{profile.branch}</span>
            </span>
            <span className="text-[#2B2052]">|</span>
            <span className="text-[#A78BFA] font-medium">{savedSkillsCount} skills</span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#150F2B] border border-[#2B2052] text-[#A096C8] hover:text-white"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 bg-[#07050D] border-b border-[#2B2052] space-y-1">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2B2052] text-xs text-[#A096C8]">
            <span>Profile: Year {profile.year} ({profile.branch})</span>
            <span className="text-[#5EEAD4] font-semibold">{readinessPct}% Ready</span>
          </div>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-[#150F2B] text-white border border-[#A78BFA]'
                    : 'text-[#A096C8] hover:bg-[#100B20]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#7C3AED]/30 text-[#5EEAD4] border border-[#5EEAD4]/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
