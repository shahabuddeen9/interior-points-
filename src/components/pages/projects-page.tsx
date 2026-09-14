import React, { useState, useEffect } from "react";
import { Project } from "../../types";
import { Link } from "../../lib/router";
import { initialProjects } from "../../../server/seedData";
import { Search, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(true);
  const [bhkFilter, setBhkFilter] = useState<string>("All");
  const [roomFilter, setRoomFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesBhk = bhkFilter === "All" || project.bhkType.toLowerCase() === bhkFilter.toLowerCase();
    const matchesRoom =
      roomFilter === "All" ||
      project.roomTypes.some((r) => r.toLowerCase().includes(roomFilter.toLowerCase()));
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBhk && matchesRoom && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[var(--accent-foreground)] font-semibold mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Residences</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            Completed Residences
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed font-body">
            A curated archive of 1, 2, and 3 BHK residences delivered by our studio exclusively across
            Mumbai with our strict 60-day dream home delivery guarantee. Filter by configuration or room
            discipline to inspect cabinetry, finishes, and spatial layouts.
          </p>
        </div>

        {/* Minimalist Filter Bar */}
        <div className="pb-8 mb-12 border-b border-[var(--border)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search by society or Mumbai locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-3 text-xs sm:text-sm rounded-[var(--radius)] border border-[var(--border)] bg-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* BHK Filter */}
            <div className="md:col-span-4 flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--muted-foreground)] shrink-0">
                BHK:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["All", "1 BHK", "2 BHK", "3 BHK"].map((bhk) => (
                  <button
                    key={bhk}
                    onClick={() => setBhkFilter(bhk)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      bhkFilter === bhk
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {bhk}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Filter */}
            <div className="md:col-span-3 flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--muted-foreground)] shrink-0">
                Discipline:
              </span>
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="h-9 px-2.5 rounded-[var(--radius)] border border-[var(--border)] bg-white text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="All">All Disciplines</option>
                <option value="Kitchen">Kitchens</option>
                <option value="Wardrobe">Wardrobes</option>
                <option value="Living">Living Spaces</option>
                <option value="Ceiling">Ceilings</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-1">
            <span>Showing {filteredProjects.length} completed residences</span>
            {(bhkFilter !== "All" || roomFilter !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setBhkFilter("All");
                  setRoomFilter("All");
                  setSearchQuery("");
                }}
                className="text-[var(--accent-foreground)] hover:underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Minimalist Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <h3 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              No matching residences found
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Try broadening your search query or selecting "All" BHK configurations.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBhkFilter("All");
                setRoomFilter("All");
                setSearchQuery("");
              }}
              className="mt-2"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block space-y-4"
              >
                {/* Photographic frame */}
                <div className="relative aspect-[16/11] rounded-[var(--radius)] overflow-hidden bg-neutral-100 border border-[var(--border)]">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Editorial Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span className="uppercase tracking-wider font-semibold text-[var(--accent-foreground)]">
                      {project.bhkType} • {project.timeline}
                    </span>
                    <span>{project.location}, {project.city}</span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                  </div>

                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed font-body">
                    {project.description}
                  </p>

                  <div className="text-xs font-medium text-[var(--foreground)] pt-1">
                    Budget: {project.budgetRange}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
