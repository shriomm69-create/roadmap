import React from 'react';

interface MapskillsCoverProps {
  onEnterApp: () => void;
  onEnterBTech: () => void;
  rolesCount: number;
  catsCount: number;
  skillsCount: number;
}

export const MapskillsCover: React.FC<MapskillsCoverProps> = ({
  onEnterApp,
  onEnterBTech,
  rolesCount,
  catsCount,
  skillsCount,
}) => {
  return (
    <section id="cover" className="wrap cover">
      {/* Exact original hero */}
      <h1 className="grad">
        Skill Development<br />Roadmap
      </h1>
      <br />
      <br />
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn" id="go" onClick={onEnterApp}>
          Build my roadmap
        </button>
        <button
          className="btn ghost text-[#5EEAD4] border-[#5EEAD4]/40 hover:border-[#5EEAD4] hover:bg-[#5EEAD4]/10"
          onClick={onEnterBTech}
        >
          🎓 Explore B.Tech Placement Module →
        </button>
      </div>

      {/* Exact animated road SVG from reference */}
      <svg
        className="road"
        viewBox="0 0 960 250"
        role="img"
        aria-label="A winding path from foundations through core skills and projects to job-ready"
      >
        <defs>
          <linearGradient id="lg" x1="0" x2="1">
            <stop offset="0" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#E879F9" />
          </linearGradient>
          <filter id="gl" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <path
          d="M30 200 C 180 200, 200 70, 330 70 S 520 200, 640 160 S 800 50, 930 60"
          fill="none"
          stroke="url(#lg)"
          strokeWidth="10"
          filter="url(#gl)"
          opacity=".6"
        />
        <path
          className="flow"
          d="M30 200 C 180 200, 200 70, 330 70 S 520 200, 640 160 S 800 50, 930 60"
          fill="none"
          stroke="url(#lg)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <g fill="#07050D" stroke="#A78BFA" strokeWidth="4">
          <circle cx="30" cy="200" r="13" />
          <circle cx="330" cy="70" r="13" />
          <circle cx="640" cy="160" r="13" />
        </g>
        <circle cx="930" cy="60" r="17" fill="#E879F9" />
        <text x="30" y="236">
          Your branch
        </text>
        <text x="330" y="44" textAnchor="middle">
          Core skills
        </text>
        <text className="sub" x="330" y="100" textAnchor="middle">
          gaps filled in order
        </text>
        <text x="640" y="196" textAnchor="middle">
          Projects
        </text>
        <text className="sub" x="640" y="214" textAnchor="middle">
          proof of skill
        </text>
        <text x="930" y="32" textAnchor="end">
          Target job role
        </text>
      </svg>

      {/* Flow row */}
      <div className="flowrow" id="flow">
        <div className="fc">
          <h3>Academic branch</h3>
          <p>Where you start from</p>
        </div>
        <div className="fc">
          <h3>Career interests</h3>
          <p>What you want to build</p>
        </div>
        <div className="fc">
          <h3>Current skills</h3>
          <p>What you already know</p>
        </div>
        <div className="fc">
          <h3>Target job role</h3>
          <p>Where you want to land</p>
        </div>
        <div className="fc out">
          <h3>Personalized roadmap</h3>
          <p>Ordered skills, progress tracked</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats" id="stats">
        <div>
          <b className="grad">{rolesCount.toLocaleString()}</b>
          <span>target roles</span>
        </div>
        <div>
          <b className="grad">{catsCount.toLocaleString()}</b>
          <span>career areas</span>
        </div>
        <div>
          <b className="grad">{skillsCount.toLocaleString()}</b>
          <span>trackable skills</span>
        </div>
      </div>
      <p className="foot">
        Role paths cover web, backend, API, distributed systems and blockchain engineering.
      </p>

      {/* B.Tech Placement Hub Spotlight Card */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#150F2B] via-[#2A1458] to-[#150F2B] border border-[#7C3AED] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E879F9]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] text-xs font-semibold text-[#5EEAD4]">
              ✨ NEW: B.TECH PLACEMENT ACCELERATOR
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Targeting Top Tech & Core Engineering Placements?
            </h2>
            <p className="text-sm text-[#A096C8]">
              Personalized roadmap by <b>1st, 2nd, 3rd, or 4th Year</b> and <b>Branch</b> (CSE, IT, ECE, EE, ME, Civil, AI/DS). Complete with an interactive Quiz Zone, diagnostic Skill Gap Analysis, Capstone Project blueprints, and ATS Resume checklists.
            </p>
          </div>
          <button
            onClick={onEnterBTech}
            className="btn whitespace-nowrap bg-gradient-to-r from-[#5EEAD4] to-[#A78BFA] text-[#07050D] font-bold"
          >
            Launch Placement Prep →
          </button>
        </div>
      </div>

      {/* Original About Section */}
      <div className="about">
        {/* Why a roadmap */}
        <div className="sec">
          <h2>Why a roadmap?</h2>
          <p>Too many courses, no clear order.</p>
          <div className="vs">
            <div className="col bad">
              <h3>Without guidance</h3>
              <div className="nd">Hundreds of courses</div>
              <div className="nd">No clear order</div>
              <div className="nd">Skills that miss the job</div>
            </div>
            <div className="col good">
              <h3>With our roadmap</h3>
              <div className="nd">Your branch and goals</div>
              <div className="nd">Ordered skill groups</div>
              <div className="nd">A clear next step</div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="sec">
          <h2>How it works</h2>
          <p>Every skill follows the same loop.</p>
          <div className="scroll">
            <svg
              className="fl"
              viewBox="0 0 950 315"
              role="img"
              aria-label="Flowchart: choose branch and interest, pick a target role, check each skill, tick it or learn it, progress updates until the role is complete"
            >
              <defs>
                <marker
                  id="ah"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M0 0L10 5L0 10z" />
                </marker>
              </defs>
              <path className="ln" d="M160 80H208" />
              <path className="ln" d="M340 80H398" />
              <path className="ln" d="M560 80H618" />
              <path className="ln" d="M480 130V198" />
              <path className="ln" d="M560 230H618" />
              <path className="ln" d="M680 110V198" />
              <path className="ln" d="M740 230H788" />
              <rect x="10" y="50" width="150" height="60" rx="12" />
              <text x="85" y="77">Choose branch</text>
              <text x="85" y="95">and interest</text>
              <rect x="210" y="50" width="130" height="60" rx="12" />
              <text x="275" y="77">Pick a</text>
              <text x="275" y="95">target role</text>
              <polygon points="400,80 480,30 560,80 480,130" />
              <text x="480" y="76">Know this</text>
              <text x="480" y="94">skill?</text>
              <rect x="620" y="50" width="120" height="60" rx="12" />
              <text x="680" y="85">Tick it off</text>
              <rect x="400" y="200" width="160" height="60" rx="12" />
              <text x="480" y="227">Learn it,</text>
              <text x="480" y="245">then tick</text>
              <rect x="620" y="200" width="120" height="60" rx="12" />
              <text x="680" y="227">Progress</text>
              <text x="680" y="245">updates</text>
              <rect className="fin" x="790" y="200" width="150" height="60" rx="12" />
              <text x="865" y="227">Job-ready</text>
              <text x="865" y="245">roadmap done</text>
              <text className="lb" x="590" y="70">Yes</text>
              <text className="lb" x="500" y="168">No</text>
              <text className="nt" x="765" y="190">all groups done</text>
              <text className="nt" x="480" y="300">repeat for every skill group</text>
            </svg>
          </div>
        </div>

        {/* Who it helps */}
        <div className="sec">
          <h2>Who it helps</h2>
          <p>One skill map, three audiences.</p>
          <div className="who">
            <div>
              <b>Students</b>
              <span>Know what to learn next.</span>
            </div>
            <div>
              <b>Mentors</b>
              <span>Advise with a shared skill map.</span>
            </div>
            <div>
              <b>Placement teams</b>
              <span>Spot skill gaps early.</span>
            </div>
          </div>
        </div>

        {/* Where we are going */}
        <div className="sec">
          <h2>Where we are going</h2>
          <p>A working prototype today, with room to grow.</p>
          <div className="steps">
            <div className="now">
              <b>Today</b>
              <small>9 role paths with tracked progress</small>
            </div>
            <div>
              <b>Next</b>
              <small>Resources and projects per skill</small>
            </div>
            <div>
              <b>Then</b>
              <small>AI-generated roadmaps</small>
            </div>
            <div>
              <b>Later</b>
              <small>Institute-wide skill insights</small>
            </div>
          </div>
          <p className="note">Guidance, not a placement guarantee. Progress stays in your browser.</p>
        </div>
      </div>

      {/* End CTA card */}
      <div className="end">
        <p>Ready to see your own path? Pick a branch, choose a role and start ticking off skills.</p>
        <button className="btn" id="go2" onClick={onEnterApp}>
          Build my roadmap
        </button>
      </div>
    </section>
  );
};
