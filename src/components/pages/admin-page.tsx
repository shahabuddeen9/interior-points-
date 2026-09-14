import React, { useState, useEffect } from "react";
import { ConsultationLead, Project, Testimonial, CredibilityStat, BHKType } from "../../types";
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
  AlertCircle,
  Edit3,
  ExternalLink,
  Search,
  Image as ImageIcon,
  Star,
  Layers,
  Sparkles,
  Filter
} from "lucide-react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";
import { ProjectEditorModal } from "../admin/project-editor-modal";

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
  const [authHint, setAuthHint] = useState("");

  const [activeTab, setActiveTab] = useState<"leads" | "projects" | "stats" | "testimonials">("leads");

  // Leads state
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectBhkFilter, setProjectBhkFilter] = useState("All");
  const [projectNotification, setProjectNotification] = useState("");

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    bhkType: "2 BHK",
    location: "Asalpha, Mumbai",
    quote: "",
    rating: 5,
  });

  // Stats state
  const [stats, setStats] = useState<CredibilityStat[]>([]);
  const [statsSaving, setStatsSaving] = useState(false);
  const [statsMessage, setStatsMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthHint("");
    const entered = passcode.trim();

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: entered }),
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem("interiorpoints_admin_auth", "true");
        } catch {}
      } else {
        setAuthError(data.error || "Incorrect password.");
        setAuthHint(data.hint || "Hint: birth year");
      }
    } catch {
      if (entered === "saifi@2005" || entered === "interiorpoints2026" || entered === "nivas2026") {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem("interiorpoints_admin_auth", "true");
        } catch {}
      } else {
        setAuthError("Incorrect password.");
        setAuthHint("Hint: birth year");
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
    loadTestimonials();
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

  const loadTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const json = await res.json();
      if (json.success) setTestimonials(json.data);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
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

  // Projects Management
  const handleOpenAddProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setProjectToEdit(proj);
    setIsProjectModalOpen(true);
  };

  const handleProjectSaved = (saved: Project) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id || p.slug === saved.slug);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setProjectNotification(`Project "${saved.title}" was saved successfully.`);
    setTimeout(() => setProjectNotification(""), 4000);
  };

  const handleDeleteProject = async (projectId: string, projectTitle?: string) => {
    const displayName = projectTitle || "this project";
    if (!window.confirm(`Are you sure you want to delete ${displayName} from the database?`)) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId && p.slug !== projectId));
        setProjectNotification(`Project "${displayName}" was deleted.`);
        setTimeout(() => setProjectNotification(""), 4000);
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Testimonials Management
  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name.trim() || !newTestimonial.quote.trim()) return;
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTestimonial.name.trim(),
          bhkType: newTestimonial.bhkType,
          location: newTestimonial.location.trim(),
          quote: newTestimonial.quote.trim(),
          rating: Number(newTestimonial.rating) || 5,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTestimonials((prev) => [data.data, ...prev]);
        setIsAddingTestimonial(false);
        setNewTestimonial({
          name: "",
          bhkType: "2 BHK",
          location: "Asalpha, Mumbai",
          quote: "",
          rating: 5,
        });
      }
    } catch (err) {
      console.error("Failed to create testimonial:", err);
    }
  };

  const handleDeleteTestimonial = async (testId: string) => {
    if (!window.confirm("Are you sure you want to remove this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials/${testId}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== testId));
      }
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
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
                Admin Password
              </label>
              <Input
                type="password"
                placeholder="Enter password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
              />
            </div>

            {authError && (
              <div className="space-y-2">
                <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xs border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{authError}</span>
                </div>
                {authHint && (
                  <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xs border border-amber-200 flex items-center gap-2">
                    <span className="text-sm">💡</span>
                    <span className="font-semibold">{authHint}</span>
                  </div>
                )}
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
                loadTestimonials();
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
            className={`px-4 py-2.5 rounded-t-[var(--radius)] text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-all shrink-0 ${
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
            className={`px-4 py-2.5 rounded-t-[var(--radius)] text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === "projects"
                ? "bg-white border-t border-x border-[var(--border)] text-[var(--foreground)] shadow-xs -mb-[1px]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Briefcase className="h-4 w-4 text-[var(--accent)]" />
            <span>Portfolio Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-4 py-2.5 rounded-t-[var(--radius)] text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === "testimonials"
                ? "bg-white border-t border-x border-[var(--border)] text-[var(--foreground)] shadow-xs -mb-[1px]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Quote className="h-4 w-4 text-[var(--accent)]" />
            <span>Client Reviews ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2.5 rounded-t-[var(--radius)] text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-all shrink-0 ${
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
            {/* Notification Banner */}
            {projectNotification && (
              <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[var(--radius)]">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{projectNotification}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                  Portfolio Projects Management
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Add new portfolio transformations, edit existing projects, scopes, and manage full image galleries.
                </p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={handleOpenAddProject}
                className="text-xs shrink-0 flex items-center space-x-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Project</span>
              </Button>
            </div>

            {/* Filter & Search Controls */}
            <div className="p-4 bg-white rounded-[var(--radius)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search projects by title, location, or scope..."
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[var(--border)] rounded-[var(--radius)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
                <Filter className="h-3.5 w-3.5 text-[var(--muted-foreground)] shrink-0" />
                {["All", "1 BHK", "2 BHK", "3 BHK", "Penthouse", "Villa"].map((bhk) => (
                  <button
                    key={bhk}
                    onClick={() => setProjectBhkFilter(bhk)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all shrink-0 ${
                      projectBhkFilter === bhk
                        ? "bg-[var(--accent)] text-white border-[var(--accent)] font-semibold"
                        : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-neutral-50"
                    }`}
                  >
                    {bhk}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Project List */}
            {(() => {
              const filteredProjects = projects.filter((p) => {
                const matchesQuery =
                  !projectSearchQuery.trim() ||
                  p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                  p.location.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                  p.description.toLowerCase().includes(projectSearchQuery.toLowerCase());
                const matchesBhk =
                  projectBhkFilter === "All" || p.bhkType === projectBhkFilter;
                return matchesQuery && matchesBhk;
              });

              if (filteredProjects.length === 0) {
                return (
                  <div className="p-12 text-center bg-white rounded-[var(--radius)] border border-[var(--border)]">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      No portfolio projects match your search criteria.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProjectSearchQuery("");
                        setProjectBhkFilter("All");
                      }}
                      className="mt-3 text-xs"
                    >
                      Clear Filters
                    </Button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((p) => {
                    const totalImages = (p.images && p.images.length > 0) ? p.images.length : (p.coverImage ? 1 : 0);
                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-neutral-100 relative">
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                            <span className="px-2 py-0.5 rounded-xs bg-black/80 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                              {p.bhkType}
                            </span>
                            {p.featured && (
                              <span className="px-2 py-0.5 rounded-xs bg-amber-500/90 text-white text-[10px] font-semibold uppercase flex items-center space-x-0.5 shadow-xs">
                                <Star className="h-2.5 w-2.5 fill-current" />
                                <span>Featured</span>
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-xs bg-black/70 text-white text-[10px] font-medium flex items-center space-x-1 backdrop-blur-xs">
                            <ImageIcon className="h-3 w-3" />
                            <span>{totalImages} {totalImages === 1 ? 'photo' : 'photos'}</span>
                          </div>
                        </div>

                        <div className="p-4 space-y-2 flex-1">
                          <div className="flex items-center text-xs text-[var(--muted-foreground)]">
                            <MapPin className="h-3 w-3 mr-1 text-[var(--accent)] shrink-0" />
                            <span className="truncate">{p.location}, {p.city}</span>
                          </div>
                          <h4 className="font-display text-base font-bold text-[var(--foreground)] line-clamp-1">
                            {p.title}
                          </h4>
                          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                            {p.description}
                          </p>
                          {p.scope && p.scope.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {p.scope.slice(0, 2).map((item, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 bg-neutral-100 text-[var(--muted-foreground)] rounded-xs truncate max-w-[150px]"
                                >
                                  {item}
                                </span>
                              ))}
                              {p.scope.length > 2 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-[var(--muted-foreground)] rounded-xs">
                                  +{p.scope.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="p-4 pt-2 border-t border-[var(--border)]/70 flex items-center justify-between bg-neutral-50/50">
                          <div className="text-xs font-semibold text-[var(--foreground)]">
                            {p.budgetRange}
                            <span className="text-[10px] text-[var(--muted-foreground)] block font-normal">
                              {p.timeline}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Link
                              href={`/projects/${p.slug}`}
                              target="_blank"
                              className="p-1.5 text-neutral-600 hover:text-[var(--accent)] hover:bg-neutral-100 rounded-xs transition-colors"
                              title="View live project page"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditProject(p)}
                              className="p-1.5 text-neutral-700 hover:text-[var(--accent)] hover:bg-neutral-100 rounded-xs transition-colors flex items-center space-x-1 text-xs font-medium"
                              title="Edit project content and images"
                            >
                              <Edit3 className="h-4 w-4 text-[var(--accent)]" />
                              <span className="hidden xl:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xs transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Tab 3: Testimonials */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                  Client Reviews & Testimonials
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Manage verified customer testimonials appearing across the homepage and portfolio.
                </p>
              </div>
              <Button
                variant={isAddingTestimonial ? "outline" : "gold"}
                size="sm"
                onClick={() => setIsAddingTestimonial(!isAddingTestimonial)}
                className="text-xs"
              >
                {isAddingTestimonial ? "Cancel" : "Add Testimonial"}
              </Button>
            </div>

            {/* Add Testimonial Form */}
            {isAddingTestimonial && (
              <form onSubmit={handleCreateTestimonial} className="p-6 bg-white rounded-[var(--radius)] border border-[var(--border)] shadow-xs space-y-4">
                <h4 className="font-display text-base font-bold text-[var(--foreground)]">
                  Add Verified Client Review
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">Client Name</label>
                    <Input
                      required
                      placeholder="e.g. Vikram & Sneha Nair"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">BHK Configuration</label>
                    <select
                      value={newTestimonial.bhkType}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, bhkType: e.target.value })}
                      className="h-11 w-full rounded-[var(--radius)] border border-[var(--border)] px-3 text-xs bg-white"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)]">Location / Society</label>
                    <Input
                      required
                      placeholder="e.g. Asalpha, Ghatkopar West"
                      value={newTestimonial.location}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--foreground)]">Client Review Quote</label>
                  <Textarea
                    required
                    rows={3}
                    placeholder="Describe their experience with Interior Points Studio..."
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--foreground)] mr-2">Star Rating:</label>
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                      className="h-9 rounded-[var(--radius)] border border-[var(--border)] px-2 text-xs"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                      <option value={3}>⭐⭐⭐ 3 Stars</option>
                    </select>
                  </div>
                  <Button type="submit" variant="gold" size="sm" className="text-xs font-semibold uppercase">
                    Publish Testimonial
                  </Button>
                </div>
              </form>
            )}

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-5 rounded-[var(--radius)] border border-[var(--border)] shadow-xs flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                          <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[var(--muted-foreground)]">{t.date || "Verified Client"}</span>
                    </div>
                    <p className="text-xs text-[var(--foreground)] italic line-clamp-4">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)]/70 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-[var(--foreground)]">{t.name}</h5>
                      <span className="text-[10px] text-[var(--muted-foreground)]">{t.bhkType} • {t.location}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-xs"
                      title="Delete review"
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

        {/* Project Editor Modal (Add/Edit Project & Gallery) */}
        <ProjectEditorModal
          isOpen={isProjectModalOpen}
          projectToEdit={projectToEdit}
          onClose={() => setIsProjectModalOpen(false)}
          onSave={handleProjectSaved}
        />
      </div>
    </div>
  );
}
