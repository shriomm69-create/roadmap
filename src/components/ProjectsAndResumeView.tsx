import React, { useState } from 'react';
import type { CareerPath, ProjectIdea, StudentProfile } from '../types/index.ts';
import { PROJECT_IDEAS } from '../data/projectIdeas.ts';

interface ProjectsAndResumeViewProps {
  profile: StudentProfile;
  onUpdateProjects: (projects: StudentProfile['customProjects']) => void;
}

export const ProjectsAndResumeView: React.FC<ProjectsAndResumeViewProps> = ({
  profile,
  onUpdateProjects,
}) => {
  const [selectedPath, setSelectedPath] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Form state for adding custom student project
  const [newTitle, setNewTitle] = useState('');
  const [newPath, setNewPath] = useState(profile.targetPath || 'sde');
  const [newDifficulty, setNewDifficulty] = useState('Intermediate');
  const [newGithub, setNewGithub] = useState('');
  const [newLiveUrl, setNewLiveUrl] = useState('');
  const [newStatus, setNewStatus] = useState<'Planned' | 'In Progress' | 'Completed'>('In Progress');
  const [newNotes, setNewNotes] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);

  const filteredIdeas = PROJECT_IDEAS.filter((p) => {
    const matchesPath = selectedPath === 'all' || p.careerPath === selectedPath;
    const matchesDiff = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
    return matchesPath && matchesDiff;
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj = {
      id: `custom-proj-${Date.now()}`,
      title: newTitle.trim(),
      path: newPath,
      difficulty: newDifficulty,
      githubUrl: newGithub.trim(),
      liveUrl: newLiveUrl.trim(),
      status: newStatus,
      notes: newNotes.trim(),
    };

    onUpdateProjects([...(profile.customProjects || []), newProj]);
    setNewTitle('');
    setNewGithub('');
    setNewLiveUrl('');
    setNewNotes('');
    setIsAddingProject(false);
  };

  const handleRemoveProject = (id: string) => {
    onUpdateProjects((profile.customProjects || []).filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string, current: string) => {
    const nextStatus = current === 'Completed' ? 'In Progress' : 'Completed';
    onUpdateProjects(
      (profile.customProjects || []).map((p) =>
        p.id === id ? { ...p, status: nextStatus as any } : p
      )
    );
  };

  return (
    <div className="wrap max-w-[1180px] mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#150F2B] via-[#241348] to-[#150F2B] border border-[#2B2052] space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] text-xs font-semibold text-[#5EEAD4]">
          🛠️ CAPSTONE ARCHITECTURE & PORTFOLIO
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Projects & ATS Resume Preparation
        </h1>
        <p className="text-xs md:text-sm text-[#A096C8] max-w-2xl leading-relaxed">
          Top-tier interviewers evaluate code through system trade-offs, architecture decisions, and measurable outcomes. Choose blueprints below or log your genuine project portfolio.
        </p>
      </div>

      {/* STUDENT'S GENUINE PROJECT TRACKER */}
      <div className="p-6 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🚀</span> Your Genuine Placement Portfolio
            </h2>
            <p className="text-xs text-[#A096C8]">
              Log projects you have actively designed, implemented, and pushed to GitHub.
            </p>
          </div>
          <button
            onClick={() => setIsAddingProject(!isAddingProject)}
            className="btn py-2 px-4 text-xs font-bold bg-gradient-to-r from-[#5EEAD4] to-[#A78BFA] text-[#07050D]"
          >
            {isAddingProject ? 'Cancel' : '+ Add Project'}
          </button>
        </div>

        {/* Add Project Form */}
        {isAddingProject && (
          <form
            onSubmit={handleAddProject}
            className="p-5 rounded-xl bg-[#100B20] border border-[#7C3AED] space-y-4 animate-fadeIn"
          >
            <div className="font-bold text-sm text-[#5EEAD4]">Log New Project Achievement</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A096C8]">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Task Queue in Node/Redis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-[#A096C8]">Career Track</label>
                <select
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  className="text-xs"
                >
                  <option value="sde">Software Development (SDE)</option>
                  <option value="aiml">AI & Machine Learning</option>
                  <option value="data_analytics">Data Analytics</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="core_embedded">Core & Embedded</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#A096C8]">GitHub Repository URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/username/project"
                  value={newGithub}
                  onChange={(e) => setNewGithub(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-[#A096C8]">Live Deployed Demo URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://my-app.run.app"
                  value={newLiveUrl}
                  onChange={(e) => setNewLiveUrl(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#A096C8]">Project Highlights & Architecture Notes</label>
              <textarea
                rows={2}
                placeholder="Mention libraries used, concurrency handling, database optimizations, or throughput benchmark results..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="text-xs"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingProject(false)}
                className="btn ghost text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn text-xs font-bold bg-gradient-to-r from-[#5EEAD4] to-[#A78BFA] text-[#07050D]"
              >
                Save Project
              </button>
            </div>
          </form>
        )}

        {/* Existing Projects List */}
        <div className="space-y-3">
          {(profile.customProjects || []).length === 0 ? (
            <div className="p-6 text-center text-xs text-[#A096C8] bg-[#100B20] rounded-xl border border-[#2B2052]">
              No custom projects entered yet. Click "+ Add Project" above to register your capstones.
            </div>
          ) : (
            (profile.customProjects || []).map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-[#100B20] border border-[#2B2052] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{proj.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        proj.status === 'Completed'
                          ? 'bg-[#5EEAD4]/20 text-[#5EEAD4] border border-[#5EEAD4]/40'
                          : 'bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/40'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                  {proj.notes && <p className="text-xs text-[#A096C8]">{proj.notes}</p>}
                  <div className="flex items-center gap-4 text-xs text-[#5EEAD4]">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span>🔗 GitHub Repo</span>
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span>🌐 Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleToggleStatus(proj.id, proj.status)}
                    className="btn ghost text-xs"
                  >
                    {proj.status === 'Completed' ? 'Mark In Progress' : 'Mark as Completed'}
                  </button>
                  <button
                    onClick={() => handleRemoveProject(proj.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 text-xs"
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CURATED CAPSTONE BLUEPRINTS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B2052] pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>💡</span> Curated Placement Project Blueprints
            </h2>
            <p className="text-xs text-[#A096C8]">
              High-signal project ideas that demonstrate deep engineering skills to campus recruiters.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
              className="text-xs py-1.5"
            >
              <option value="all">All Paths</option>
              <option value="sde">Software Engineering</option>
              <option value="aiml">AI / ML</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="core_embedded">Core / Embedded</option>
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs py-1.5"
            >
              <option value="all">All Difficulties</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="p-5 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-4 hover:border-[#A78BFA]/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-[#E879F9] uppercase tracking-wider">
                  {idea.careerPath.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#100B20] text-[#5EEAD4] border border-[#2B2052]">
                  {idea.difficulty} · {idea.duration}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{idea.title}</h3>
                <p className="text-xs text-[#A096C8] mt-1 leading-relaxed">{idea.description}</p>
              </div>

              {/* Tech Stack */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#A096C8] mb-1.5">
                  Tech Stack:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {idea.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-[#100B20] text-[#A78BFA] border border-[#2B2052]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#A096C8] mb-1.5">
                  Key Features to Implement:
                </div>
                <ul className="text-xs text-[#F1ECFF] space-y-1">
                  {idea.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#5EEAD4] font-bold">›</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ready ATS Resume Bullet */}
              <div className="p-3 rounded-xl bg-[#100B20] border border-[#2B2052] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4] flex items-center justify-between">
                  <span>ATS Resume Impact Bullet:</span>
                  <span className="text-[#A096C8] font-normal">XYZ Formula</span>
                </div>
                <p className="text-xs font-mono text-white/90 italic">"{idea.atsResumeBullet}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
