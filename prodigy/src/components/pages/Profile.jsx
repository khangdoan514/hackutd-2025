import React, { useMemo } from "react";
import "./Profile.css";

/**
 * Profile page for an employee/manager.
 * Pass `person` as a prop, or remove props and use the mock data below.
 */
export default function Profile({ person = MOCK_PERSON }) {
  const initials = useMemo(() => {
    const parts = `${person.firstName || ""} ${person.lastName || ""}`
      .trim()
      .split(/\s+/);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase() || "").join("");
  }, [person.firstName, person.lastName]);

  return (
    <div className="profile-page">
      {/* Header Card */}
      <section className="card profile-header">
        <div className="avatar" aria-label={`${person.firstName} ${person.lastName} avatar`}>
          {person.photoUrl ? (
            <img src={person.photoUrl} alt={`${person.firstName} ${person.lastName}`} />
          ) : (
            <span className="initials">{initials}</span>
          )}
        </div>

        <div className="identity">
          <h1 className="name">
            {person.firstName} {person.lastName}
          </h1>
          <div className="role-line">
            <span className="title">{person.title}</span>
            <span className="dot">•</span>
            <span className="dept">{person.department}</span>
            {person.isManager && <span className="badge badge-manager">Manager</span>}
          </div>

          <div className="meta">
            <span className="meta-item">
              <i className="i i-location" aria-hidden /> {person.location || "—"}
            </span>
            <span className="meta-item">
              <i className="i i-id" aria-hidden /> Employee ID: {person.employeeId || "—"}
            </span>
            {person.managerName && (
              <span className="meta-item">
                <i className="i i-user" aria-hidden /> Reports to: {person.managerName}
              </span>
            )}
          </div>

          <div className="actions">
            <a className="btn" href={`mailto:${person.email}`}>Email</a>
            {person.phone && <a className="btn btn-ghost" href={`tel:${person.phone}`}>Call</a>}
            {person.calendarUrl && (
              <a className="btn btn-ghost" href={person.calendarUrl} target="_blank" rel="noreferrer">
                View Calendar
              </a>
            )}
            <button className="btn btn-outline" onClick={() => alert("Edit profile clicked")}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="quick-stats">
          <div className="stat">
            <div className="stat-value">{person.tenureYears ?? "—"}</div>
            <div className="stat-label">Years at Company</div>
          </div>
          <div className="stat">
            <div className="stat-value">{person.directReports ?? 0}</div>
            <div className="stat-label">Direct Reports</div>
          </div>
          <div className="stat">
            <div className="stat-value">{person.projects?.length ?? 0}</div>
            <div className="stat-label">Active Projects</div>
          </div>
          <div className="stat">
            <div className={`availability ${person.availability?.status || "unknown"}`}>
              {person.availability?.status || "—"}
            </div>
            <div className="stat-label">Availability</div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="content-grid">
        {/* Contact */}
        <div className="card">
          <h2 className="card-title">Contact</h2>
          <div className="kv">
            <div className="k">Email</div>
            <div className="v"><a href={`mailto:${person.email}`}>{person.email}</a></div>

            <div className="k">Phone</div>
            <div className="v">{person.phone || "—"}</div>

            <div className="k">Location</div>
            <div className="v">{person.location || "—"}</div>

            <div className="k">Time Zone</div>
            <div className="v">{person.timezone || "—"}</div>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <h2 className="card-title">About</h2>
          <p className="about">
            {person.bio ||
              "No bio provided yet. Use the Edit Profile action to add a short professional bio."}
          </p>
          {person.skills?.length > 0 && (
            <>
              <h3 className="subtle">Skills</h3>
              <div className="tags">
                {person.skills.map(s => (
                  <span className="tag" key={s}>{s}</span>
                ))}
              </div>
            </>
          )}
          {person.tools?.length > 0 && (
            <>
              <h3 className="subtle">Primary Tools</h3>
              <div className="tags">
                {person.tools.map(t => (
                  <span className="tag tag-ghost" key={t}>{t}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Projects */}
        <div className="card">
          <h2 className="card-title">Projects</h2>
          {person.projects?.length ? (
            <ul className="list">
              {person.projects.map(p => (
                <li key={p.id} className="list-item">
                  <div className="li-main">
                    <div className="li-title">{p.name}</div>
                    <div className="li-sub">
                      <span>{p.role}</span>
                      <span className="dot">•</span>
                      <span>{p.status}</span>
                    </div>
                  </div>
                  {p.link && (
                    <a className="link" href={p.link} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No current projects.</p>
          )}
        </div>

        {/* Team */}
        <div className="card">
          <h2 className="card-title">Team & Reporting</h2>
          <div className="kv">
            <div className="k">Department</div>
            <div className="v">{person.department || "—"}</div>

            <div className="k">Manager</div>
            <div className="v">{person.managerName || "—"}</div>

            <div className="k">Direct Reports</div>
            <div className="v">
              {person.directReportNames?.length
                ? person.directReportNames.join(", ")
                : person.directReports || 0}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** --- Mock Data (remove in prod) --- */
const MOCK_PERSON = {
  firstName: "Noah",
  lastName: "Rivera",
  title: "Senior Product Manager",
  department: "Product Management",
  isManager: true,
  email: "noah.rivera@example.com",
  phone: "+1 (555) 010-2368",
  employeeId: "EMP-48219",
  location: "Dallas, TX",
  timezone: "America/Chicago (UTC-6)",
  managerName: "Alexis Turner",
  directReports: 4,
  directReportNames: ["Priya Patel", "Luca Chen", "Maya Ortiz", "Ben Kramer"],
  tenureYears: 3,
  availability: { status: "available" }, // available | busy | away | unknown
  bio:
    "Product leader focused on AI-assisted workflows and regulatory-grade delivery. Previously at Finch & Co. building clinician tooling.",
  skills: ["Product Strategy", "Roadmapping", "SQL", "JIRA", "A/B Testing"],
  tools: ["Jira", "Figma", "Notion", "Looker"],
  photoUrl: "", // leave empty to show initials
  calendarUrl: "#",
  projects: [
    { id: "p1", name: "Intake Orchestrator", role: "Owner", status: "Active", link: "#" },
    { id: "p2", name: "GTM Analytics Revamp", role: "Contributor", status: "Planning", link: "#" },
  ],
};
