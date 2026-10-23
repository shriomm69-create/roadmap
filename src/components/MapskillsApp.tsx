import React, { useState, useMemo, useEffect } from 'react';
import mapskillsDataRaw from '../data/mapskillsData.json';
import skillResourcesRaw from '../data/skillResources.json';
import {
  calculateRoleScore,
  getFitTier,
  isItemKnown,
} from '../utils/roadmapLogic.ts';

interface MapskillsAppProps {
  onBackToOverview: () => void;
  savedSkills: Set<number>;
  onToggleSkill: (id: number) => void;
  onClearSkills: () => void;
  onAddSkills: (ids: number[]) => void;
  onRemoveSkills: (ids: number[]) => void;
}

interface RoleData {
  n: string;
  c: number;
  f: string;
  g: [string, number, (number | number[])[]][];
}

interface MapskillsData {
  cats: string[];
  skills: [string, number][];
  roles: RoleData[];
  alias: Record<string, number[]>;
  packs: { n: string; ids: number[] }[];
  sc: Record<string, number[]>;
}

const data = mapskillsDataRaw as MapskillsData;
const skillResources = skillResourcesRaw as Record<string, { title: string; url: string }[]>;

function resourceKey(value: string): string {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const resourceIndex = new Map<string, { title: string; url: string }[]>();
Object.entries(skillResources).forEach(([name, items]) => {
  resourceIndex.set(resourceKey(name), items);
});

function getResources(name: string) {
  return resourceIndex.get(resourceKey(name)) || [];
}

export const MapskillsApp: React.FC<MapskillsAppProps> = ({
  onBackToOverview,
  savedSkills,
  onToggleSkill,
  onClearSkills,
  onAddSkills,
  onRemoveSkills,
}) => {
  const [mode, setMode] = useState<'browse' | 'skills'>('browse');
  const [currentRoleIndex, setCurrentRoleIndex] = useState<number>(0);
  const [roleSearch, setRoleSearch] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<number>(-1);
  const [skillSearch, setSkillSearch] = useState<string>('');
  const [skillArea, setSkillArea] = useState<string>('common');
  const [skillCatalogShowCount, setSkillCatalogShowCount] = useState<number>(90);
  const [rankedRolesShowCount, setRankedRolesShowCount] = useState<number>(12);
  const [fitRoleFilterArea, setFitRoleFilterArea] = useState<number>(-1);

  const categories = data.cats;
  const roles = data.roles;
  const skills = data.skills;
  const aliases = data.alias;
  const packs = data.packs;

  const currentRole = roles[currentRoleIndex] || roles[0];

  // Calculate score for the currently active role
  const currentRoleScore = useMemo(() => {
    return calculateRoleScore(currentRole, savedSkills, roles.length, skills, aliases);
  }, [currentRole, savedSkills, roles.length, skills, aliases]);

  // Missing skills for the current role
  const missingSkills = useMemo(() => {
    const miss: [number | number[], string][] = [];
    for (const g of currentRole.g) {
      for (const it of g[2]) {
        if (!isItemKnown(it, savedSkills, aliases)) {
          miss.push([it, g[0]]);
          if (miss.length >= 3) return miss;
        }
      }
    }
    return miss;
  }, [currentRole, savedSkills, aliases]);

  // Filtered roles list in sidebar
  const filteredRoles = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    return roles
      .map((r, i) => ({ r, i }))
      .filter((item) => {
        const matchesCategory = selectedArea < 0 || item.r.c === selectedArea;
        const matchesQuery =
          !q ||
          (item.r.n + ' ' + item.r.f + ' ' + categories[item.r.c]).toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });
  }, [roles, roleSearch, selectedArea, categories]);

  // Skill catalog pool for "My skills" mode
  const catalogSkillIds = useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    const hiddenSet = new Set(Object.keys(aliases).map(Number));

    if (q) {
      const ids = skills
        .map((_, i) => i)
        .filter((i) => skills[i][1] > 0 && !hiddenSet.has(i) && skills[i][0].toLowerCase().includes(q));
      ids.sort((a, b) => {
        const aStart = skills[a][0].toLowerCase().startsWith(q) ? 1 : 0;
        const bStart = skills[b][0].toLowerCase().startsWith(q) ? 1 : 0;
        return bStart - aStart || skills[b][1] - skills[a][1];
      });
      return ids;
    }

    if (skillArea === 'common') {
      const ids = skills
        .map((_, i) => i)
        .filter((i) => skills[i][1] >= 3 && !hiddenSet.has(i));
      ids.sort((a, b) => skills[b][1] - skills[a][1] || skills[a][0].localeCompare(skills[b][0]));
      return ids;
    }

    const areaNum = Number(skillArea);
    const ids = Object.keys(data.sc)
      .map(Number)
      .filter((i) => data.sc[String(i)]?.includes(areaNum) && !hiddenSet.has(i));
    ids.sort((a, b) => skills[b][1] - skills[a][1] || skills[a][0].localeCompare(skills[b][0]));
    return ids;
  }, [skillSearch, skillArea, skills, aliases]);

  // Ranked roles based on known skills
  const rankedRoles = useMemo(() => {
    if (savedSkills.size === 0) return [];
    const list = roles
      .map((r, i) => ({
        r,
        i,
        score: calculateRoleScore(r, savedSkills, roles.length, skills, aliases),
      }))
      .filter((x) => (fitRoleFilterArea < 0 || x.r.c === fitRoleFilterArea) && x.score.have > 0);

    list.sort((a, b) => b.score.p - a.score.p || b.score.have - a.score.have);
    return list;
  }, [roles, savedSkills, skills, aliases, fitRoleFilterArea]);

  // Helper to render skill label
  const getSkillLabel = (item: number | number[]): string => {
    if (Array.isArray(item)) {
      return 'one of ' + item.map((k) => skills[k]?.[0] || '').join(' / ');
    }
    return skills[item]?.[0] || '';
  };

  // Render a chip
  const renderChip = (k: number) => {
    const skillName = skills[k]?.[0] || '';
    const isKnown = isItemKnown(k, savedSkills, aliases);
    const resources = getResources(skillName);

    return (
      <span key={k} className="skill-item">
        <button
          className="chip"
          aria-pressed={isKnown}
          onClick={() => onToggleSkill(k)}
          title={`Click to mark ${skillName} as known/unknown`}
        >
          {skillName}
        </button>
        {resources.length > 0 && (
          <span className="skill-resources" aria-label={`Learning resources for ${skillName}`}>
            {resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {res.title}
              </a>
            ))}
          </span>
        )}
      </span>
    );
  };

  return (
    <section id="app" className="wrap">
      {/* Top Header */}
      <div className="top">
        <button className="btn ghost" id="back" onClick={onBackToOverview}>
          ← Back to overview
        </button>
        <h1 className="grad">CS career roadmap</h1>
        <div className="mode">
          <button
            className={`btn ghost ${mode === 'browse' ? 'active' : ''}`}
            aria-pressed={mode === 'browse'}
            onClick={() => setMode('browse')}
          >
            Browse roles
          </button>
          <button
            className={`btn ghost ${mode === 'skills' ? 'active' : ''}`}
            aria-pressed={mode === 'skills'}
            onClick={() => setMode('skills')}
          >
            My skills <span id="skillCount" className="ml-1 px-1.5 py-0.5 rounded-full bg-[#2B2052] text-xs font-bold text-[#A78BFA]">{savedSkills.size}</span>
          </button>
        </div>
      </div>

      {mode === 'browse' ? (
        <>
          {/* Browse tools bar */}
          <div className="prof" id="browseTools">
            <div>
              <label htmlFor="roleSearch">Search roles</label>
              <input
                type="search"
                id="roleSearch"
                placeholder="e.g. backend, security, robotics"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="areaFilter">Career area</label>
              <select
                id="areaFilter"
                value={selectedArea}
                onChange={(e) => setSelectedArea(Number(e.target.value))}
              >
                <option value="-1">All areas</option>
                {categories.map((c, i) => (
                  <option key={i} value={i}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Saved skills</label>
              <div className="saved-summary">
                <b id="savedNum" className="text-[#A78BFA]">{savedSkills.size}</b>
                <span>skills marked known on this device</span>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="layout" id="roleLayout">
            {/* Nav: Categories or Role List */}
            <nav id="nav" aria-label="Target job roles">
              {selectedArea < 0 && !roleSearch.trim() ? (
                // Category list view
                <>
                  <div className="rolelist-label">{categories.length} career categories</div>
                  {categories.map((c, ci) => {
                    const count = roles.filter((r) => r.c === ci).length;
                    return (
                      <button
                        key={ci}
                        className="category"
                        onClick={() => setSelectedArea(ci)}
                      >
                        <span className="category-dot"></span>
                        <span className="role-name">{c}</span>
                        <small>{count} roles</small>
                      </button>
                    );
                  })}
                </>
              ) : (
                // Filtered roles list view
                <>
                  <button
                    className="category-back"
                    onClick={() => {
                      setSelectedArea(-1);
                      setRoleSearch('');
                    }}
                  >
                    ← All categories
                  </button>
                  <div className="rolelist-label">
                    {selectedArea >= 0 ? categories[selectedArea] : 'All categories'} ·{' '}
                    {filteredRoles.length} roles
                  </div>
                  {filteredRoles.map(({ r, i }) => {
                    const sc = calculateRoleScore(r, savedSkills, roles.length, skills, aliases);
                    const pct = Math.round(sc.p * 100);
                    const isCurrent = currentRoleIndex === i;
                    const totalSkillsInRole = r.g.reduce((acc, g) => acc + g[2].length, 0);

                    return (
                      <button
                        key={i}
                        className="role"
                        aria-current={isCurrent}
                        onClick={() => setCurrentRoleIndex(i)}
                      >
                        <span className="mini" style={{ ['--p' as string]: pct }}>
                          <span></span>
                        </span>
                        <span className="role-name">{r.n}</span>
                        {sc.have > 0 && <em>{pct}%</em>}
                        <small>{totalSkillsInRole}</small>
                      </button>
                    );
                  })}
                  {filteredRoles.length === 0 && (
                    <div className="empty">No roles match your search.</div>
                  )}
                </>
              )}
            </nav>

            {/* Main Role Content */}
            <main>
              {/* Role Hero */}
              <section className="hero" id="roleHero">
                <div
                  className="ring"
                  style={{ ['--p' as string]: Math.round(currentRoleScore.p * 100) }}
                >
                  <div>{Math.round(currentRoleScore.p * 100)}%</div>
                </div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div className="chead" style={{ marginBottom: '4px' }}>
                    <i style={{ background: 'var(--p2)' }}></i>
                    {categories[currentRole.c]}
                  </div>
                  <h2>{currentRole.n}</h2>
                  <p>{currentRole.f}</p>
                  <p className="text-sm text-[#A096C8]">
                    {currentRoleScore.have > 0
                      ? `You have ${currentRoleScore.have} of ${currentRoleScore.tot} scored skills · ${getFitTier(currentRoleScore.p)}.`
                      : 'Mark skills as known to calculate your fit.'}
                    {missingSkills.length > 0 &&
                      ` Next: ${getSkillLabel(missingSkills[0][0])}.`}
                  </p>
                  <div className="tools mt-3">
                    <button
                      className="btn ghost text-xs"
                      onClick={() => {
                        // Reset this role's skills
                        const allIds: number[] = [];
                        currentRole.g.forEach((g) => {
                          g[2].forEach((it) => {
                            if (Array.isArray(it)) allIds.push(...it);
                            else allIds.push(it);
                          });
                        });
                        onRemoveSkills(allIds);
                      }}
                    >
                      Reset this role
                    </button>
                    <button
                      className="btn ghost text-xs"
                      onClick={() => setMode('skills')}
                    >
                      Manage my skills
                    </button>
                  </div>
                </div>
              </section>

              {/* Skill Groups */}
              <div className="groups" id="groups">
                {currentRole.g.map((g, gi) => {
                  const doneCount = g[2].filter((it) => isItemKnown(it, savedSkills, aliases)).length;
                  const totalCount = g[2].length;
                  const pct = Math.round((doneCount / totalCount) * 100);
                  const isFull = pct === 100;
                  const isAdv = g[1] === 1;
                  const parts = g[0].split(' › ');
                  const flatItems = g[2].filter((x) => !Array.isArray(x)) as number[];
                  const allFlatKnown = flatItems.length > 0 && flatItems.every((k) => isItemKnown(k, savedSkills, aliases));

                  return (
                    <article key={gi} className={`g ${isFull ? 'full' : ''}`}>
                      <div className="gh">
                        <h3>
                          {parts.length > 1
                            ? `${parts[0]} · ${parts.slice(1).join(' › ')}`
                            : parts[0]}
                        </h3>
                        {isAdv && <span className="nx">Advanced</span>}
                        <span>
                          {doneCount}/{totalCount}
                        </span>
                        {flatItems.length > 0 && (
                          <button
                            onClick={() => {
                              if (allFlatKnown) {
                                onRemoveSkills(flatItems);
                              } else {
                                onAddSkills(flatItems);
                              }
                            }}
                          >
                            {allFlatKnown ? 'Clear' : 'Mark all'}
                          </button>
                        )}
                      </div>
                      <div className="bar">
                        <i style={{ width: `${pct}%` }}></i>
                      </div>
                      <div className="chips">
                        {g[2].map((item, idx) => {
                          if (Array.isArray(item)) {
                            return (
                              <span key={idx} className="anyof">
                                {item.map((subId) => renderChip(subId))}
                              </span>
                            );
                          }
                          return renderChip(item);
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            </main>
          </div>
        </>
      ) : (
        /* Skills View (My skills catalog & live role rankings) */
        <div id="skillsView">
          <div className="two">
            {/* Left box */}
            <div className="box">
              <div className="section-head">
                <h2>
                  Your skills (<span id="cnt">{savedSkills.size}</span>)
                </h2>
                <button className="btn ghost" onClick={onClearSkills}>
                  Clear all
                </button>
              </div>

              {/* Selected skills */}
              <div className="chips sel" id="sel">
                {savedSkills.size > 0 ? (
                  Array.from(savedSkills)
                    .reverse()
                    .map((k) => renderChip(k))
                ) : (
                  <span className="text-[#A096C8] text-sm">
                    Nothing yet. Pick skills below or start with a pack.
                  </span>
                )}
              </div>

              {/* Starter packs */}
              <div className="starter-label text-[#A096C8]">Starter packs</div>
              <div className="packs flex flex-wrap gap-2 mt-2" id="packs">
                {packs.map((p, idx) => (
                  <button
                    key={idx}
                    className="btn ghost text-xs"
                    onClick={() => onAddSkills(p.ids)}
                  >
                    + {p.n}
                  </button>
                ))}
              </div>

              {/* Skill tools: search & area */}
              <div className="tools skilltools mt-4">
                <input
                  type="search"
                  id="pq"
                  placeholder="Search the skill catalog"
                  aria-label="Search skills"
                  value={skillSearch}
                  onChange={(e) => {
                    setSkillSearch(e.target.value);
                    setSkillCatalogShowCount(90);
                  }}
                />
                <select
                  id="pc"
                  aria-label="Skill area"
                  value={skillArea}
                  onChange={(e) => {
                    setSkillArea(e.target.value);
                    setSkillSearch('');
                    setSkillCatalogShowCount(90);
                  }}
                >
                  <option value="common">Most common</option>
                  {categories.map((c, i) => (
                    <option key={i} value={i}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catalog chips */}
              <div className="chips pick" id="pick">
                {catalogSkillIds.slice(0, skillCatalogShowCount).map((k) => renderChip(k))}
                {catalogSkillIds.length === 0 && (
                  <div className="empty">No skills match your filter.</div>
                )}
              </div>

              {catalogSkillIds.length > skillCatalogShowCount && (
                <div className="mt-3">
                  <button
                    className="btn ghost text-xs w-full"
                    onClick={() => setSkillCatalogShowCount((prev) => prev + 120)}
                  >
                    Show more ({catalogSkillIds.length - skillCatalogShowCount} left)
                  </button>
                </div>
              )}
            </div>

            {/* Right stick: Best-fit roles live ranking */}
            <div className="stick">
              <div className="tools section-head">
                <h2>Best-fit roles</h2>
                <select
                  id="rc"
                  aria-label="Filter roles by area"
                  value={fitRoleFilterArea}
                  onChange={(e) => {
                    setFitRoleFilterArea(Number(e.target.value));
                    setRankedRolesShowCount(12);
                  }}
                >
                  <option value="-1">All areas</option>
                  {categories.map((c, i) => (
                    <option key={i} value={i}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div id="res" className="mt-2">
                {savedSkills.size === 0 ? (
                  <div className="empty">
                    Add skills you already have and the roles will rank here.
                  </div>
                ) : rankedRoles.length === 0 ? (
                  <div className="empty">
                    No role in this area shares a selected skill yet.
                  </div>
                ) : (
                  rankedRoles.slice(0, rankedRolesShowCount).map(({ r, i, score }, idx) => {
                    const pct = Math.round(score.p * 100);
                    const miss = [];
                    for (const g of r.g) {
                      for (const it of g[2]) {
                        if (!isItemKnown(it, savedSkills, aliases)) {
                          miss.push(it);
                          if (miss.length >= 3) break;
                        }
                      }
                      if (miss.length >= 3) break;
                    }

                    return (
                      <button
                        key={i}
                        className="res"
                        onClick={() => {
                          setCurrentRoleIndex(i);
                          setMode('browse');
                        }}
                      >
                        <span className="n">{idx + 1}</span>
                        <span>
                          <b>{r.n}</b>{' '}
                          <span className="text-[#A096C8]">· {categories[r.c]}</span>
                        </span>
                        <span className="pc">{pct}%</span>
                        <div className="bar">
                          <i style={{ width: `${pct}%` }}></i>
                        </div>
                        <span className="nx">
                          {getFitTier(score.p)} · {score.have}/{score.tot} skills
                          {miss.length > 0 &&
                            ` · next: ${miss.map((m) => getSkillLabel(m)).join(', ')}`}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {rankedRoles.length > rankedRolesShowCount && (
                <div className="mt-3">
                  <button
                    className="btn ghost text-xs w-full"
                    onClick={() => setRankedRolesShowCount((prev) => prev + 15)}
                  >
                    Show more roles ({rankedRoles.length - rankedRolesShowCount} left)
                  </button>
                </div>
              )}

              <details className="mt-4 text-xs text-[#A096C8]">
                <summary className="cursor-pointer text-[#A78BFA] hover:underline">
                  How the match is calculated
                </summary>
                <p className="mt-2 leading-relaxed">
                  Match is based on the CS Career Roadmaps scoring model. Skills that occur in fewer roles count more, advanced-stage skills count half, and “one of” groups accept any selected option. Optional/example lists are not scored.
                </p>
              </details>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
