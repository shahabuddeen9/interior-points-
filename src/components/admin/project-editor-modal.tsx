import React, { useState, useEffect, useRef } from "react";
import { Project, BHKType, RoomCategory } from "../../types";
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  Trash2,
  Star,
  Plus,
  Sparkles,
  Layers,
  Calendar,
  IndianRupee,
  MapPin,
  Building2,
  Tag
} from "lucide-react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";

interface ProjectEditorModalProps {
  isOpen: boolean;
  projectToEdit: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const PRESET_INTERIOR_PHOTOS = [
  {
    title: "Modular Kitchen (Quartz & Oak)",
    category: "Kitchen",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Luxury Island Kitchen (Charcoal & Brass)",
    category: "Kitchen",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Master Wardrobe (Fluted Glass & LED)",
    category: "Wardrobe",
    url: "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Master Bedroom (Cove Headboard)",
    category: "Full Home",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Living Room (Italian Marble & Cove)",
    category: "Living Room",
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Bespoke TV Unit & Wood Wall Paneling",
    category: "Living Room",
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Gypsum False Ceiling & Profile Lights",
    category: "False Ceiling",
    url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Contemporary Dining & Bar Space",
    category: "Full Home",
    url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Designer Bathroom & Vanity",
    category: "Full Home",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
  }
];

const ROOM_CATEGORIES: RoomCategory[] = [
  "Kitchen",
  "Wardrobe",
  "False Ceiling",
  "Living Room",
  "Full Home"
];

export function ProjectEditorModal({
  isOpen,
  projectToEdit,
  onClose,
  onSave
}: ProjectEditorModalProps) {
  const isEditing = Boolean(projectToEdit);

  const [title, setTitle] = useState("");
  const [bhkType, setBhkType] = useState<BHKType>("2 BHK");
  const [location, setLocation] = useState("Asalpha, Ghatkopar West");
  const [city, setCity] = useState("Mumbai");
  const [budgetRange, setBudgetRange] = useState("₹10.75L");
  const [timeline, setTimeline] = useState("60 Days");
  const [description, setDescription] = useState("");
  const [scopeText, setScopeText] = useState("");
  const [featured, setFeatured] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState<RoomCategory[]>([
    "Kitchen",
    "Wardrobe",
    "False Ceiling",
    "Living Room"
  ]);

  // Images state
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientQuote, setClientQuote] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state when modal opens or projectToEdit changes
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || "");
      setBhkType(projectToEdit.bhkType || "2 BHK");
      setLocation(projectToEdit.location || "");
      setCity(projectToEdit.city || "Mumbai");
      setBudgetRange(projectToEdit.budgetRange || "₹10.75L");
      setTimeline(projectToEdit.timeline || "60 Days");
      setDescription(projectToEdit.description || "");
      setScopeText(
        Array.isArray(projectToEdit.scope)
          ? projectToEdit.scope.join(", ")
          : projectToEdit.scope || ""
      );
      setFeatured(projectToEdit.featured ?? true);
      setSelectedRooms(projectToEdit.roomTypes || ["Full Home"]);
      setCoverImage(projectToEdit.coverImage || "");
      setImages(
        Array.isArray(projectToEdit.images) && projectToEdit.images.length > 0
          ? projectToEdit.images
          : projectToEdit.coverImage
          ? [projectToEdit.coverImage]
          : []
      );
      setClientName(projectToEdit.clientTestimonial?.clientName || "");
      setClientQuote(projectToEdit.clientTestimonial?.quote || "");
    } else {
      // Default new project
      setTitle("");
      setBhkType("2 BHK");
      setLocation("Asalpha, Ghatkopar West");
      setCity("Mumbai");
      setBudgetRange("₹10.75L Package");
      setTimeline("60 Days");
      setDescription(
        "Bespoke turnkey home renovation executed with 18mm semi-marine ply, acrylic finishes, and full architectural coordination."
      );
      setScopeText(
        "Modular kitchen with 3 tandem drawers, Master wardrobe with loft, Gypsum false ceiling, Wall molding & PU paint"
      );
      setFeatured(true);
      setSelectedRooms(["Kitchen", "Wardrobe", "False Ceiling", "Living Room"]);
      const defaultImg =
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80";
      setCoverImage(defaultImg);
      setImages([
        defaultImg,
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=80"
      ]);
      setClientName("");
      setClientQuote("");
    }
    setErrorMessage("");
    setNewImageUrl("");
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  // Toggle room selection
  const handleToggleRoom = (room: RoomCategory) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  // Add image by URL
  const handleAddImageUrl = (urlToAdd?: string) => {
    const url = (urlToAdd || newImageUrl).trim();
    if (!url) return;
    if (!images.includes(url)) {
      const updated = [...images, url];
      setImages(updated);
      if (!coverImage) setCoverImage(url);
    }
    setNewImageUrl("");
  };

  // Handle local file uploads (supports multi-file selection)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCover = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          if (isCover) {
            setCoverImage(result);
            if (!images.includes(result)) {
              setImages((prev) => [result, ...prev]);
            }
          } else {
            setImages((prev) => {
              if (prev.includes(result)) return prev;
              const next = [...prev, result];
              if (!coverImage) setCoverImage(result);
              return next;
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = "";
  };

  // Set an existing image as the cover
  const handleSetCover = (imgUrl: string) => {
    setCoverImage(imgUrl);
  };

  // Remove an image from gallery
  const handleRemoveImage = (imgUrl: string) => {
    const remaining = images.filter((img) => img !== imgUrl);
    setImages(remaining);
    if (coverImage === imgUrl) {
      setCoverImage(remaining[0] || "");
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setErrorMessage("Please fill in Project Title and Location.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const scopeArray = scopeText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const finalCover = coverImage || images[0] || PRESET_INTERIOR_PHOTOS[0].url;
    const finalImages = images.length > 0 ? images : [finalCover];

    const payload: Partial<Project> = {
      title: title.trim(),
      bhkType,
      location: location.trim(),
      city: city.trim(),
      budgetRange: budgetRange.trim(),
      timeline: timeline.trim(),
      description: description.trim(),
      scope: scopeArray,
      roomTypes: selectedRooms.length > 0 ? selectedRooms : ["Full Home"],
      coverImage: finalCover,
      images: finalImages,
      featured,
      clientTestimonial: clientName.trim()
        ? {
            clientName: clientName.trim(),
            quote: clientQuote.trim() || "Exceptional craftsmanship and seamless handover."
          }
        : undefined
    };

    try {
      if (isEditing && projectToEdit?.id) {
        // Update existing project
        const res = await fetch(`/api/projects/${projectToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update project");
        }
        onSave(data.data);
      } else {
        // Create new project
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create project");
        }
        onSave(data.data);
      }
      onClose();
    } catch (err: any) {
      console.error("Save project error:", err);
      setErrorMessage(err.message || "An error occurred while saving the project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      id="project-editor-modal"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl border border-[var(--border)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-neutral-50/80 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                {isEditing ? `Edit Residence: ${projectToEdit?.title}` : "Add New Portfolio Residence"}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Updates save instantly to backend database and reflect live across the entire website.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-neutral-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)] text-[var(--foreground)] font-semibold uppercase tracking-wider text-[11px]">
              <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>General Residence Metadata</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-[var(--foreground)]">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Asalpha Residence Sanctuary, Powai Skyline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--foreground)]">
                  BHK Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={bhkType}
                  onChange={(e) => setBhkType(e.target.value as BHKType)}
                  className="h-10 w-full rounded-md border border-[var(--border)] px-3 text-xs bg-white text-[var(--foreground)] font-medium focus:ring-1 focus:ring-[var(--accent)]"
                >
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-[var(--foreground)]">
                  Location / Neighborhood <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Asalpha, Ghatkopar West"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--foreground)]">City</label>
                <Input
                  placeholder="Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--foreground)]">Execution Timeline</label>
                <Input
                  placeholder="e.g. 58 Days (60-Day Guarantee)"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--foreground)]">Budget / Package Cost</label>
                <Input
                  placeholder="e.g. ₹10.75L Package or ₹13.5L"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center space-x-3 pt-6">
                <label className="relative flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  <span className="font-semibold text-[var(--foreground)]">
                    Feature on Homepage Carousel & Top Grid
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Room Categories & Scope */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)] text-[var(--foreground)] font-semibold uppercase tracking-wider text-[11px]">
              <Tag className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Scope & Architectural Categories</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--foreground)]">
                Target Room Categories (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {ROOM_CATEGORIES.map((cat) => {
                  const isSelected = selectedRooms.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleToggleRoom(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                          : "bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--foreground)]">
                Specification Scope Items (Comma separated)
              </label>
              <Input
                placeholder="e.g. 18mm semi-marine ply kitchen, Master wardrobe with fluted glass, Gypsum ceiling with magnetic track lights"
                value={scopeText}
                onChange={(e) => setScopeText(e.target.value)}
                className="text-xs"
              />
              <p className="text-[10px] text-[var(--muted-foreground)]">
                These render as high-impact architectural bullet points in the project details view.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[var(--foreground)]">
                Design & Architectural Narrative <span className="text-rose-500">*</span>
              </label>
              <Textarea
                required
                rows={3}
                placeholder="Explain the spatial planning, materials chosen, lighting design, and lifestyle enhancements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Section 3: Project Photography & Images (The core requested feature!) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--foreground)] font-semibold uppercase tracking-wider text-[11px]">
                <ImageIcon className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>Project Gallery & High-Res Photography</span>
              </div>
              <span className="text-[11px] font-medium text-[var(--accent)]">
                {images.length} photo{images.length === 1 ? "" : "s"} attached
              </span>
            </div>

            {/* Hidden file inputs for local image upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, false)}
              multiple
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={coverFileInputRef}
              onChange={(e) => handleFileUpload(e, true)}
              accept="image/*"
              className="hidden"
            />

            {/* Upload & Add Controls */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-[var(--border)] space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 text-xs whitespace-nowrap"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Images from Device</span>
                </Button>

                <div className="flex-1 flex items-center gap-2">
                  <Input
                    placeholder="Or paste image URL (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    className="text-xs bg-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddImageUrl()}
                    className="text-xs shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add URL
                  </Button>
                </div>
              </div>

              {/* Quick Architectural Presets */}
              <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                <div className="text-[11px] font-semibold text-[var(--muted-foreground)] flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>Quick Curated Architectural Photos (Click to attach):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_INTERIOR_PHOTOS.map((preset) => {
                    const isAttached = images.includes(preset.url);
                    return (
                      <button
                        type="button"
                        key={preset.url}
                        onClick={() => handleAddImageUrl(preset.url)}
                        className={`text-[10px] px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
                          isAttached
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-medium"
                            : "bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:bg-neutral-100 hover:text-[var(--foreground)]"
                        }`}
                      >
                        {isAttached ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Plus className="h-2.5 w-2.5" />}
                        <span>{preset.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
              <div className="p-8 text-center rounded-lg border-2 border-dashed border-[var(--border)] bg-neutral-50/50">
                <ImageIcon className="h-8 w-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[var(--foreground)]">No project images attached yet</p>
                <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                  Upload photos from your computer or click one of the quick architectural presets above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((imgUrl, index) => {
                    const isCover = imgUrl === coverImage;
                    return (
                      <div
                        key={imgUrl + index}
                        className={`group relative rounded-md overflow-hidden border bg-neutral-100 aspect-[4/3] flex flex-col justify-between transition-all ${
                          isCover
                            ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30 shadow-xs"
                            : "border-[var(--border)] hover:border-neutral-400"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Project view ${index + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                          {isCover ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[var(--accent)] text-white shadow-xs">
                              Cover Photo
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/60 text-white">
                              #{index + 1}
                            </span>
                          )}
                        </div>

                        {/* Bottom Action Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                          {!isCover ? (
                            <button
                              type="button"
                              onClick={() => handleSetCover(imgUrl)}
                              className="px-2 py-1 rounded bg-white/90 hover:bg-white text-black text-[10px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
                              title="Set as project thumbnail cover"
                            >
                              <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                              <span>Set Cover</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-medium text-white flex items-center gap-1">
                              <Check className="h-3 w-3 text-emerald-400" /> Main Display
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgUrl)}
                            className="p-1 rounded bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Optional Client Testimonial */}
          <div className="space-y-4 pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)] text-[var(--foreground)] font-semibold uppercase tracking-wider text-[11px]">
              <Star className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Client Review for this Project (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--foreground)]">Client Name / Family</label>
                <Input
                  placeholder="e.g. Rohan & Ananya Deshmukh"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-[var(--foreground)]">Client Quote</label>
                <Input
                  placeholder="e.g. Delivered on day 58 within the 60-day promise. Impeccable kitchen finish."
                  value={clientQuote}
                  onChange={(e) => setClientQuote(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end space-x-3 sticky bottom-0 bg-white z-10 pb-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={saving}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={saving}
              className="text-xs font-semibold uppercase tracking-wider min-w-[140px]"
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Residence"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
