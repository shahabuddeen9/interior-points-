import React, { useState, useEffect } from "react";
import { ConsultationLead, Project, Testimonial, CredibilityStat } from "../../types";
import { Link } from "../../lib/router";
import {
  Users,
  Briefcase,
  Quote,
  BarChart3,
  Trash2,
  CheckCircle,
  Plus,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  MapPin,
  Eye,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";

export function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return (
        sessionStorage.getItem("interiorpoints_admin_auth") === "true" ||
        sessionStorage.getItem("nivas_admin_auth") === "true"
      );
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"leads" | "projects" | "stats" | "testimonials">("leads");

  // Leads state
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    bhkType: "2 BHK",
    location: "Indiranagar",
    city: "Bengaluru",
    budgetRange: "₹9.5L – ₹12.5L",
    timeline: "45 Days",
    coverImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    description: "",
    scope: "Modular kitchen, Master wardrobe, False ceiling",
  });

  // Stats state
  const [stats, setStats] = useState<CredibilityStat[]>([]);
  const [statsSaving, setStatsSaving] = useState(false);
  const [statsMessage, setStatsMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem("interiorpoints_admin_auth", "true");
        } catch {}
      } else {
        setAuthError("Invalid credentials. Access restricted to authorized studio personnel.");
      }
    } catch {
      if (passcode.trim() === "interiorpoints2026" || passcode.trim() === "nivas2026") {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem("interiorpoints_admin_auth", "true");
        } catch {}
      } else {
        setAuthError("Invalid credentials. Access restricted to authorized studio personnel.");
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    try {
      sessionStorage.removeItem("interiorpoints_admin_auth");
      sessionStorage.removeItem("nivas_admin_auth");
    } catch {
      // Ignore
    }
  };

  // Fetch data on auth
  useEffect(() => {
    if (!isAuthenticated) return;
    loadLeads();
    loadProjects();
    loadStats();
  }, [isAuthenticated]);

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (json.success) setLeads(json.data);
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.success) setProjects(json.data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleLeadStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? json.data : l)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to remove this consultation lead?")) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: newProject.title,
        bhkType: newProject.bhkType,
        location: newProject.location,
        city: newProject.city,
        budgetRange: newProject.budgetRange,
        timeline: newProject.timeline,
        coverImage: newProject.coverImage,
        description: newProject.description,
        scope: newProject.scope.split(",").map((s) => s.trim()),
        roomTypes: ["Living Room", "Modular Kitchen", "Master Bedroom"],
        images: [newProject.coverImage],
        featured: true,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setProjects((prev) => [json.data, ...prev]);
        setIsAddingProject(false);
        setNewProject({
          title: "",
          bhkType: "2 BHK",
          location: "Indiranagar",
          city: "Bengaluru",
          budgetRange: "₹9.5L – ₹12.5L",
          timeline: "45 Days",
          coverImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
          description: "",
          scope: "Modular kitchen, Master wardrobe, False ceiling",
        });
      }
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project from the database?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleSaveStats = async () => {
    setStatsSaving(true);
    setStatsMessage("");
    try {
      const res = await fetch("/api/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats }),
      });
      const json = await res.json();
      if (json.success) {
        setStatsMessage("Credibility statistics saved and live on homepage!");
      }
    } catch (err) {
      console.error("Failed to save stats:", err);
      setStatsMessage("Error saving stats");
    } finally {
      setStatsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-24 bg-[var(--background)] min-h-[75vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-8 rounded-[var(--radius)] bg-white border border-[var(--border)] shadow-xs space-y-6">
          <div className="text-center space-y-1.5">
            <div className="h-10 w-10 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center mx-auto mb-2">
              <Lock className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
              Studio Portal
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Restricted workspace for studio team members.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                Security Passcode
              </label>
              <Input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
              />
            </div>

            {authError && (
              <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xs border border-rose-200">
                {authError}
              </div>
            )}

            <Button type="submit" variant="primary" size="md" className="w-full text-xs font-semibold uppercase tracking-wider">
              Authenticate
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[var(--accent-foreground)] font-semibold mb-1">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span>Studio Management</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">
              Studio Admin & Lead Operations
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadLeads();
                loadProjects();
                loadStats();
              }}
              className="text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Sync Data
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="text-xs"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-[var(--border)] pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2.5 rounded-t-[var(--radius)] text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-all ${
              activeTab === "leads"
                ? "bg-white border-t border-x border-[var(--border)] text-[var(--foreground)] shadow-xs -mb-[1px]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Users className="h-4 w-4 text-[var(--accent)]" />
            <span>Consultation Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2.5 rounded-t-[var(--radius)] text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-all ${
              activeTab === "projects"
                ? "bg-white border-t border-x border-[var(--border)] text-[var(--foreground)] shadow-xs -mb-[1px]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Briefcase className="h-4 w-4 text-[var(--accent)]" />
            <span>Portfolio Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2.5 rounded-t-[var(--radius)] text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-all ${
              activeTab === "stats"
                ? "bg-white border-t border-x border-[var(--border)] text-[var(--foreground)] shadow-xs -mb-[1px]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <BarChart3 className="h-4 w-4 text-[var(--accent)]" />
            <span>Homepage Stats</span>
          </button>
        </div>

        {/* Tab 1: Leads */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                  Active Consultation Inquiries
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Persisted directly to backend storage. Leads arrive in real time from the booking forms.
                </p>
              </div>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-[var(--radius)] border border-[var(--border)]">
                <p className="text-sm text-[var(--muted-foreground)]">
                  No consultation leads recorded yet. Try submitting the booking form on the homepage or contact page.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[var(--secondary)]/50 border-b border-[var(--border)] text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">
                        <th className="p-3.5">Client & Contact</th>
                        <th className="p-3.5">City & BHK</th>
                        <th className="p-3.5">Message / Requirements</th>
                        <th className="p-3.5">Date & Time</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-3.5 font-medium">
                            <div className="font-semibold text-[var(--foreground)] text-sm">{lead.name}</div>
                            <div className="text-[var(--muted-foreground)] mt-0.5">{lead.phone}</div>
                            <div className="text-[var(--muted-foreground)] text-[11px]">{lead.email}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-xs bg-[var(--secondary)] text-[var(--foreground)] font-semibold">
                              {lead.bhkType}
                            </span>
                            <div className="text-[var(--muted-foreground)] mt-1">{lead.city}</div>
                          </td>
                          <td className="p-3.5 max-w-xs text-[var(--muted-foreground)]">
                            {lead.message || "No custom note provided."}
                          </td>
                          <td className="p-3.5 text-[var(--muted-foreground)] whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString()} <br />
                            <span className="text-[10px]">{new Date(lead.createdAt).toLocaleTimeString()}</span>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={lead.status}
                              onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                              className={`text-xs font-semibold px-2 py-1 rounded-xs border ${
                                lead.status === "new"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : lead.status === "contacted"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : lead.status === "scheduled"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-neutral-100 text-neutral-700 border-neutral-200"
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xs transition-colors"
                              title="Remove lead"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Projects */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                  Portfolio Projects Management
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Add new real-estate transformations or manage existing showcase items.
                </p>
              </div>
              <Button
                variant={isAddingProject ? "outline" : "primary"}
                size="sm"
                onClick={() => setIsAddingProject(!isAddingProject)}
                className="text-xs"
              >
                {isAddingProject ? "Cancel" : "Add New Project"}
              </Button>
            </div>

            {/* Add Project Form */}
            {isAddingProject && (
              <form onSubmit={handleCreateProject} className="p-6 bg-white rounded-[var(--radius)] border border-[var(--border)] shadow-xs space-y-4">
                <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                  Add New Portfolio Item
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">Project Title</label>
                    <Input
                      required
                      placeholder="e.g. Prestige Lake Ridge"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">BHK Type</label>
                    <select
                      value={newProject.bhkType}
                      onChange={(e) => setNewProject({ ...newProject, bhkType: e.target.value })}
                      className="h-11 w-full rounded-[var(--radius)] border border-[var(--border)] px-3 text-xs"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">Location</label>
                    <Input
                      required
                      placeholder="e.g. Indiranagar, Bengaluru"
                      value={newProject.location}
                      onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">Budget Range</label>
                    <Input
                      placeholder="e.g. ₹9.5L – ₹12.5L"
                      value={newProject.budgetRange}
                      onChange={(e) => setNewProject({ ...newProject, budgetRange: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">Timeline</label>
                    <Input
                      placeholder="e.g. 45 Days"
                      value={newProject.timeline}
                      onChange={(e) => setNewProject({ ...newProject, timeline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">Cover Image URL</label>
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      value={newProject.coverImage}
                      onChange={(e) => setNewProject({ ...newProject, coverImage: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--foreground)]">Scope (comma separated)</label>
                  <Input
                    placeholder="Modular kitchen with quartz, Floor to ceiling wardrobes, Gypsum false ceiling"
                    value={newProject.scope}
                    onChange={(e) => setNewProject({ ...newProject, scope: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--foreground)]">Architectural Description</label>
                  <Textarea
                    required
                    placeholder="Describe the aesthetic direction, layout optimizations, and client requirements..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>

                <Button type="submit" variant="gold" size="md" className="text-xs font-semibold uppercase tracking-wider">
                  Save Project to Database
                </Button>
              </form>
            )}

            {/* List of projects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-100 relative">
                    <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-black/75 text-white text-[10px] font-semibold uppercase">
                      {p.bhkType}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {p.location}, {p.city}
                    </div>
                    <h4 className="font-display text-base font-bold text-[var(--foreground)]">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <div className="p-4 pt-0 border-t border-[var(--border)]/70 flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold text-[var(--foreground)]">{p.budgetRange}</span>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-xs"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Stats */}
        {activeTab === "stats" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                Credibility Statistics
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                These numbers display in the About section and Hero trust indicators on the homepage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-[var(--radius)] border border-[var(--border)] shadow-xs space-y-5">
              {stats.map((stat, idx) => (
                <div key={stat.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center border-b border-[var(--border)]/70 pb-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">
                      Display Metric
                    </label>
                    <Input
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx].value = e.target.value;
                        setStats(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">
                      Title Label
                    </label>
                    <Input
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx].label = e.target.value;
                        setStats(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[var(--muted-foreground)]">
                      Description Note
                    </label>
                    <Input
                      value={stat.description}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx].description = e.target.value;
                        setStats(updated);
                      }}
                    />
                  </div>
                </div>
              ))}

              {statsMessage && (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-xs border border-emerald-200">
                  {statsMessage}
                </div>
              )}

              <Button
                variant="primary"
                size="md"
                disabled={statsSaving}
                onClick={handleSaveStats}
                className="text-xs font-semibold uppercase tracking-wider"
              >
                {statsSaving ? "Saving..." : "Save Changes to Homepage"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
