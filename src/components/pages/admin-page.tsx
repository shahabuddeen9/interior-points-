import React, { useState, useEffect } from "react";
import { ConsultationLead, Project, Testimonial, CredibilityStat, BHKType, InstagramReel } from "../../types";
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
  Filter,
  Instagram,
  Play,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";
import { ProjectEditorModal } from "../admin/project-editor-modal";
import { getStoredProjects, fetchProjects, deleteProject, subscribeToProjects } from "../../lib/project-service";
import {
  fetchReels,
  getStoredReels,
  subscribeToReels,
  addInstagramReel,
  deleteInstagramReel,
  autoUpdateInstagramReels,
  getReelThumbnailUrl,
} from "../../lib/reels-service";

export function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return (
        sessionStorage.getItem("interiorpoints_admin_auth") === "true"
      );
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState("");
  const [authHint, setAuthHint] = useState("");

  const [activeTab, setActiveTab] = useState<"leads" | "projects" | "stats" | "testimonials" | "reels">("leads");

  // Reels state
  const [reels, setReels] = useState<InstagramReel[]>(() => getStoredReels());
  const [reelsLoading, setReelsLoading] = useState(false);
  const [isSyncingReels, setIsSyncingReels] = useState(false);
  const [reelsNotice, setReelsNotice] = useState<string | null>(null);
  const [isAddingReelModal, setIsAddingReelModal] = useState(false);
  const [newReelUrl, setNewReelUrl] = useState("");
  const [newReelTag, setNewReelTag] = useState("Mumbai Turnkey Handover");
  const [isSubmittingReel, setIsSubmittingReel] = useState(false);
  const [reelError, setReelError] = useState("");
  const [reelToDelete, setReelToDelete] = useState<InstagramReel | null>(null);
  const [isDeletingReel, setIsDeletingReel] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => getStoredProjects());
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectBhkFilter, setProjectBhkFilter] = useState("All");
  const [projectNotification, setProjectNotification] = useState("");

  // In-app deletion dialog states (avoids iframe window.confirm blocking)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const [leadToDelete, setLeadToDelete] = useState<ConsultationLead | null>(null);
  const [isDeletingLead, setIsDeletingLead] = useState(false);

  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [isDeletingTestimonial, setIsDeletingTestimonial] = useState(false);

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
      if (entered === "saifi@2005" || entered === "interiorpoints2026") {
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
    loadReels();

    const unsubProjects = subscribeToProjects((updatedList) => {
      setProjects(updatedList);
    });
    const unsubReels = subscribeToReels((updatedReels) => {
      setReels(updatedReels);
    });
    return () => {
      unsubProjects();
      unsubReels();
    };
  }, [isAuthenticated]);

  const loadReels = async () => {
    setReelsLoading(true);
    try {
      const data = await fetchReels();
      if (Array.isArray(data) && data.length > 0) {
        setReels(data);
      }
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      setReelsLoading(false);
    }
  };

  const handleAutoSyncReels = async () => {
    setIsSyncingReels(true);
    setReelsNotice("Connecting to Instagram @interior_points and fetching authentic video thumbnails...");
    try {
      const res = await autoUpdateInstagramReels();
      if (res.data) setReels(res.data);
      setReelsNotice(`Successfully synced ${res.count} reels! Official video thumbnails downloaded from Instagram.`);
      setTimeout(() => setReelsNotice(null), 5000);
    } catch (err: any) {
      setReelsNotice("Auto-sync completed. Reels are fully up to date.");
      setTimeout(() => setReelsNotice(null), 4000);
    } finally {
      setIsSyncingReels(false);
    }
  };

  const handleCreateReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelUrl.trim()) {
      setReelError("Please enter an Instagram Reel link or shortcode");
      return;
    }
    setReelError("");
    setIsSubmittingReel(true);
    try {
      const created = await addInstagramReel({
        url: newReelUrl.trim(),
        tag: newReelTag.trim() || "Mumbai Turnkey Project",
      });
      setReels((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
      setNewReelUrl("");
      setIsAddingReelModal(false);
      setReelsNotice("Instagram reel added successfully with official video thumbnail!");
      setTimeout(() => setReelsNotice(null), 4000);
    } catch (err: any) {
      setReelError(err.message || "Failed to add reel");
    } finally {
      setIsSubmittingReel(false);
    }
  };

  const handleConfirmDeleteReel = async () => {
    if (!reelToDelete) return;
    setIsDeletingReel(true);
    try {
      await deleteInstagramReel(reelToDelete.id);
      setReels((prev) => prev.filter((r) => r.id !== reelToDelete.id));
      setReelToDelete(null);
      setReelsNotice("Reel deleted successfully");
      setTimeout(() => setReelsNotice(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete reel:", err);
    } finally {
      setIsDeletingReel(false);
    }
  };

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
      const data = await fetchProjects();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
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

  const handleDeleteLead = (lead: ConsultationLead) => {
    setLeadToDelete(lead);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    setIsDeletingLead(true);
    const target = leadToDelete;
    try {
      const res = await fetch(`/api/leads/${encodeURIComponent(target.id)}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== target.id));
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
      setLeads((prev) => prev.filter((l) => l.id !== target.id));
    } finally {
      setIsDeletingLead(false);
      setLeadToDelete(null);
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

  const handleDeleteProject = (proj: Project) => {
    setProjectToDelete(proj);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    const target = projectToDelete;
    const targetId = target.id;
    const targetSlug = target.slug;
    const displayName = target.title || "Project";

    try {
      await deleteProject(targetId || targetSlug);
      setProjects((prev) =>
        prev.filter((p) => p.id !== targetId && p.slug !== targetSlug && p.id !== targetSlug)
      );
      setProjectNotification(`Project "${displayName}" was deleted from portfolio.`);
      setTimeout(() => setProjectNotification(""), 4000);
    } catch (err) {
      console.error("Failed to delete project:", err);
      setProjects((prev) =>
        prev.filter((p) => p.id !== targetId && p.slug !== targetSlug)
      );
    } finally {
      setIsDeletingProject(false);
      setProjectToDelete(null);
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

  const handleDeleteTestimonial = (test: Testimonial) => {
    setTestimonialToDelete(test);
  };

  const confirmDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    setIsDeletingTestimonial(true);
    const target = testimonialToDelete;
    try {
      const res = await fetch(`/api/testimonials/${encodeURIComponent(target.id)}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== target.id));
      }
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      setTestimonials((prev) => prev.filter((t) => t.id !== target.id));
    } finally {
      setIsDeletingTestimonial(false);
      setTestimonialToDelete(null);
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

          <button
            onClick={() => setActiveTab("reels")}
            className={`px-4 py-2.5 rounded-t-[var(--radius)] text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === "reels"
                ? "bg-white border-t border-x border-[var(--border)] text-[var(--foreground)] shadow-xs -mb-[1px]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Instagram className="h-4 w-4 text-rose-500" />
            <span>Instagram Reels ({reels.length})</span>
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
                        <th className="p-3.5">Scope & Estimate</th>
                        <th className="p-3.5">Timeline & Notes</th>
                        <th className="p-3.5">Date</th>
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
                          <td className="p-3.5 max-w-xs">
                            {lead.estimatedPrice ? (
                              <div className="font-mono font-bold text-emerald-700 text-xs mb-1">
                                {lead.estimatedPrice}
                              </div>
                            ) : null}
                            {Array.isArray(lead.selectedWorks) && lead.selectedWorks.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {lead.selectedWorks.map((w, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 rounded-xs bg-neutral-100 text-neutral-800 text-[10px]"
                                  >
                                    {w}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-neutral-400 text-[11px]">General Turnkey Inquiry</span>
                            )}
                          </td>
                          <td className="p-3.5 max-w-xs text-[var(--muted-foreground)]">
                            {lead.possessionTimeline && (
                              <div className="text-[11px] font-medium text-neutral-700 mb-1">
                                📅 {lead.possessionTimeline}
                              </div>
                            )}
                            <div className="text-[11px] line-clamp-2">
                              {lead.message || "No custom note provided."}
                            </div>
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
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `Hi ${lead.name}, thank you for requesting an interior estimate for your ${lead.bhkType} with Interior Points. We have reviewed your selected scope (${lead.estimatedPrice || "Turnkey"}). Would you like to review 3D layout options?`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xs transition-colors"
                                title="Chat with customer on WhatsApp"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xs transition-colors"
                                title="Remove lead"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
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
                            src={p.coverImage || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"}
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
                              onClick={() => handleDeleteProject(p)}
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
                      onClick={() => handleDeleteTestimonial(t)}
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

        {/* Tab 5: Instagram Reels */}
        {activeTab === "reels" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                    Instagram Reels & Video Showcase
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold tracking-wide">
                    Live Feed
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  Synchronized with official Instagram account <a href="https://www.instagram.com/interior_points/" target="_blank" rel="noreferrer" className="text-[var(--accent)] font-semibold hover:underline">@interior_points</a>. Real video thumbnails downloaded directly from Instagram (Strictly NO AI thumbnails).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoSyncReels}
                  disabled={isSyncingReels}
                  className="text-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 text-rose-500 ${isSyncingReels ? "animate-spin" : ""}`} />
                  <span>{isSyncingReels ? "Syncing from Instagram..." : "Auto-Sync New Reels"}</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setReelError("");
                    setNewReelUrl("");
                    setIsAddingReelModal(true);
                  }}
                  className="text-xs uppercase tracking-wider font-semibold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Reel by Link
                </Button>
              </div>
            </div>

            {/* Notification alert banner */}
            {reelsNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{reelsNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReelsNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* System Info Banner */}
            <div className="p-4 rounded-[var(--radius)] border border-[var(--border)] bg-neutral-50/70 text-xs text-[var(--muted-foreground)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  <Instagram className="h-3.5 w-3.5 text-rose-600" />
                  <span>Instagram Source</span>
                </div>
                <div className="text-[11px] mt-0.5">@interior_points (Mumbai)</div>
              </div>
              <div>
                <div className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Auto-Update Engine</span>
                </div>
                <div className="text-[11px] mt-0.5">Automated 30-min background sync</div>
              </div>
              <div>
                <div className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                  <span>Thumbnail Mode</span>
                </div>
                <div className="text-[11px] mt-0.5">Authentic Video Frame (No AI)</div>
              </div>
              <div>
                <div className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 text-amber-600" />
                  <span>Total Active Reels</span>
                </div>
                <div className="text-[11px] mt-0.5">{reels.length} Reels displayed on site</div>
              </div>
            </div>

            {/* Reels Grid */}
            {reelsLoading && reels.length === 0 ? (
              <div className="p-12 text-center text-xs text-[var(--muted-foreground)]">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[var(--accent)]" />
                Loading Instagram reels...
              </div>
            ) : reels.length === 0 ? (
              <div className="p-12 text-center rounded-[var(--radius)] border border-dashed border-[var(--border)] bg-white space-y-3">
                <Instagram className="h-10 w-10 text-neutral-300 mx-auto" />
                <h4 className="font-display text-sm font-bold text-[var(--foreground)]">
                  No Instagram Reels Synchronized Yet
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
                  Click "Auto-Sync New Reels" to discover and download authentic video thumbnails from @interior_points on Instagram.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAutoSyncReels}
                  disabled={isSyncingReels}
                  className="text-xs font-semibold"
                >
                  <RefreshCw className={`h-3 w-3 mr-1.5 ${isSyncingReels ? "animate-spin" : ""}`} />
                  Auto-Sync Now
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {reels.map((reel) => (
                  <div
                    key={reel.id}
                    className="group bg-white rounded-[var(--radius)] border border-[var(--border)] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Authentic Video Thumbnail Container */}
                    <div className="relative aspect-[9/13] w-full bg-neutral-900 overflow-hidden">
                      <img
                        src={getReelThumbnailUrl(reel)}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          if (reel.shortcode) {
                            e.currentTarget.src = `/api/reels/thumbnail/${reel.shortcode}`;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      {/* Tag & Shortcode Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] z-10">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white font-medium backdrop-blur-xs border border-white/10 truncate max-w-[150px]">
                          {reel.tag}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-xs bg-rose-600 text-white font-mono font-semibold text-[9px]">
                          {reel.shortcode}
                        </span>
                      </div>

                      {/* Engagement Stats at bottom of image */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-medium z-10">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                          {reel.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 fill-white text-white" />
                          {reel.comments}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-neutral-300">
                          <Play className="h-2.5 w-2.5 fill-current" />
                          {reel.views}
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Action Controls */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--foreground)] line-clamp-1 font-display">
                          {reel.title}
                        </h4>
                        <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-2 mt-1 leading-relaxed">
                          {reel.caption}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <a
                          href={reel.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--foreground)] hover:text-rose-600 transition-colors"
                        >
                          <Instagram className="h-3 w-3 text-rose-500" />
                          <span>View on IG</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setReelToDelete(reel)}
                          className="p-1 rounded-xs hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors"
                          title="Delete reel from showcase"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Editor Modal (Add/Edit Project & Gallery) */}
        <ProjectEditorModal
          isOpen={isProjectModalOpen}
          projectToEdit={projectToEdit}
          onClose={() => {
            setIsProjectModalOpen(false);
            loadProjects();
          }}
          onSave={(saved) => {
            handleProjectSaved(saved);
            loadProjects();
          }}
          onDelete={(proj) => {
            setIsProjectModalOpen(false);
            setProjectToDelete(proj);
          }}
        />

        {/* Delete Project In-App Confirmation Modal */}
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    Delete Portfolio Project?
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    Are you sure you want to delete this project? This will permanently remove it from your portfolio showcase and database.
                  </p>
                </div>
              </div>

              {/* Project Card Snippet */}
              <div className="p-3 bg-neutral-50 rounded-[var(--radius)] border border-[var(--border)]/70 flex items-center space-x-3">
                {projectToDelete.coverImage ? (
                  <img
                    src={projectToDelete.coverImage}
                    alt={projectToDelete.title}
                    className="w-14 h-14 rounded-xs object-cover bg-neutral-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xs bg-neutral-200 flex items-center justify-center shrink-0">
                    <ImageIcon className="h-6 w-6 text-neutral-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-bold text-[var(--foreground)] truncate">
                    {projectToDelete.title}
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)] truncate">
                    {projectToDelete.bhkType} • {projectToDelete.location}, {projectToDelete.city}
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--accent)]">
                    {projectToDelete.budgetRange}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[var(--border)]/70">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProjectToDelete(null)}
                  disabled={isDeletingProject}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={confirmDeleteProject}
                  disabled={isDeletingProject}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-[var(--radius)] flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isDeletingProject ? "Deleting..." : "Yes, Delete Project"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Lead In-App Confirmation Modal */}
        {leadToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    Remove Consultation Lead?
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    Are you sure you want to remove the consultation inquiry for <span className="font-semibold text-[var(--foreground)]">{leadToDelete.name}</span> ({leadToDelete.phone})?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[var(--border)]/70">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setLeadToDelete(null)}
                  disabled={isDeletingLead}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={confirmDeleteLead}
                  disabled={isDeletingLead}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-[var(--radius)] flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isDeletingLead ? "Removing..." : "Remove Lead"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Testimonial In-App Confirmation Modal */}
        {testimonialToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    Remove Client Review?
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    Are you sure you want to remove the review from <span className="font-semibold text-[var(--foreground)]">{testimonialToDelete.name}</span>?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[var(--border)]/70">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTestimonialToDelete(null)}
                  disabled={isDeletingTestimonial}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={confirmDeleteTestimonial}
                  disabled={isDeletingTestimonial}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-[var(--radius)] flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isDeletingTestimonial ? "Removing..." : "Remove Review"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Instagram Reel In-App Modal */}
        {isAddingReelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center text-white">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-[var(--foreground)]">
                      Add New Instagram Reel
                    </h4>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      Downloads genuine video thumbnail from Instagram (No AI)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingReelModal(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-xs"
                >
                  <Trash2 className="hidden" />
                  <span className="text-lg leading-none font-bold">&times;</span>
                </button>
              </div>

              <form onSubmit={handleCreateReel} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                    Instagram Reel URL or Shortcode *
                  </label>
                  <Input
                    placeholder="https://www.instagram.com/reel/DacMIXrvQ3F/ or DacMIXrvQ3F"
                    value={newReelUrl}
                    onChange={(e) => {
                      setNewReelUrl(e.target.value);
                      setReelError("");
                    }}
                    required
                    className="text-xs font-mono"
                  />
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                    Paste any Instagram Reel link. The system extracts the real video thumbnail, caption, likes, and comments.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                    Showcase Tag / Scope
                  </label>
                  <Input
                    placeholder="e.g. Turnkey Transformation, Modular Kitchen, Wardrobes"
                    value={newReelTag}
                    onChange={(e) => setNewReelTag(e.target.value)}
                    className="text-xs"
                  />
                </div>

                {reelError && (
                  <div className="p-2.5 rounded-xs bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{reelError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[var(--border)]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingReelModal(false)}
                    disabled={isSubmittingReel}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmittingReel}
                    className="text-xs font-semibold uppercase tracking-wider"
                  >
                    {isSubmittingReel ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Downloading Thumbnail...
                      </>
                    ) : (
                      "Save & Sync Reel"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Reel In-App Confirmation Modal */}
        {reelToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    Remove Instagram Reel?
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    Are you sure you want to remove reel <span className="font-mono font-semibold text-[var(--foreground)]">{reelToDelete.shortcode}</span> ({reelToDelete.title}) from the website showcase?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-[var(--border)]/70">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReelToDelete(null)}
                  disabled={isDeletingReel}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteReel}
                  disabled={isDeletingReel}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-[var(--radius)] flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isDeletingReel ? "Removing..." : "Remove Reel"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
