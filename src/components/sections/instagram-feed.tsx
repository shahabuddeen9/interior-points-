import React, { useState, useEffect } from "react";
import {
  Instagram,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  Maximize2,
  Volume2,
  Sparkles,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface InstagramReel {
  id: string;
  shortcode: string;
  url: string;
  tag: string;
  title: string;
  caption: string;
  likes: string;
  comments: string;
  views: string;
  previewImage: string;
}

export const INSTAGRAM_REELS: InstagramReel[] = [
  {
    id: "reel-1",
    shortcode: "DacMIXrvQ3F",
    url: "https://www.instagram.com/p/DacMIXrvQ3F/",
    tag: "Site Process & Civil",
    title: "Behind-the-Scenes Site Transformation",
    caption:
      "Trust the process. 🛠️✨ Behind every beautiful home is a messy, chaotic, and exciting site phase. Master craftsmen at work across Mumbai residences.",
    likes: "4.8k",
    comments: "389",
    views: "52.4k",
    previewImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "reel-2",
    shortcode: "DcDL66_vzAi",
    url: "https://www.instagram.com/p/DcDL66_vzAi/",
    tag: "Turnkey Transformation",
    title: "Raw to Refined: Full Interior Makeover",
    caption:
      "Trust the process. 🛠️✨ Save this for your future home inspiration! 📌 Transform your space with us. Complete turnkey fit-outs delivered with architectural rigor in Mumbai.",
    likes: "5.2k",
    comments: "412",
    views: "68.1k",
    previewImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "reel-3",
    shortcode: "DX0zUshor7-",
    url: "https://www.instagram.com/p/DX0zUshor7-/",
    tag: "Modular Kitchen",
    title: "Raw Studs to Culinary Sanctuary",
    caption:
      "The beauty is in the journey. 🛠️➡️🍸 We took this space from raw studs and sawdust to a sophisticated culinary sanctuary with 18mm semi-marine ply & 3 tandem drawers.",
    likes: "3.9k",
    comments: "284",
    views: "44.8k",
    previewImage:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "reel-4",
    shortcode: "DdQbt1Eo57d",
    url: "https://www.instagram.com/p/DdQbt1Eo57d/",
    tag: "Master Joinery & Wardrobes",
    title: "Precision Carpentry & 18mm Marine Ply",
    caption:
      "Trust the process. 🛠️✨ Behind every seamless wardrobe and floating TV unit is precision carpentry, zero-gap PUR edge banding, and genuine Hettich/Hafele hardware.",
    likes: "3.4k",
    comments: "196",
    views: "38.2k",
    previewImage:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "reel-5",
    shortcode: "Dc5QmjJoav5",
    url: "https://www.instagram.com/p/Dc5QmjJoav5/",
    tag: "Ceiling & Living Aesthetics",
    title: "Architectural Lighting & Gypsum Ceiling",
    caption:
      "Trust the process. 🛠️✨ Architectural cove false ceiling with warm 3000K recessed lighting, custom fluted panelling, and 2 coats of Asian Paints Royale washable finish.",
    likes: "4.1k",
    comments: "305",
    views: "49.6k",
    previewImage:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "reel-6",
    shortcode: "DcDL66_vzAi",
    url: "https://www.instagram.com/p/DcDL66_vzAi/",
    tag: "60-Day Dream Home Reveal",
    title: "60-Day Handover & Final Styling",
    caption:
      "Turnkey handover milestone: from 3D visual render to actual key handover in Mumbai within our strict 60-day dream home delivery commitment! 🔑",
    likes: "6.1k",
    comments: "520",
    views: "81.3k",
    previewImage:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  },
];

export function InstagramFeed() {
  const instagramProfileUrl = "https://www.instagram.com/interior_points/";
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null);
  const [playingInlineIds, setPlayingInlineIds] = useState<Record<string, boolean>>({});
  const [liveModeAll, setLiveModeAll] = useState(false);

  const selectedReel = selectedReelIndex !== null ? INSTAGRAM_REELS[selectedReelIndex] : null;

  // Keyboard controls for modal navigation
  useEffect(() => {
    if (selectedReelIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedReelIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedReelIndex((prev) =>
          prev !== null ? (prev === 0 ? INSTAGRAM_REELS.length - 1 : prev - 1) : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedReelIndex((prev) =>
          prev !== null ? (prev === INSTAGRAM_REELS.length - 1 ? 0 : prev + 1) : null
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedReelIndex]);

  const toggleInlinePlay = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPlayingInlineIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openReelTheater = (index: number) => {
    setSelectedReelIndex(index);
  };

  const nextReel = () => {
    setSelectedReelIndex((prev) =>
      prev !== null ? (prev === INSTAGRAM_REELS.length - 1 ? 0 : prev + 1) : null
    );
  };

  const prevReel = () => {
    setSelectedReelIndex((prev) =>
      prev !== null ? (prev === 0 ? INSTAGRAM_REELS.length - 1 : prev - 1) : null
    );
  };

  return (
    <section
      id="instagram-reels"
      className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative overflow-hidden"
    >
      {/* Subtle Background Accent Lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header with Instagram Identity & Live Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[var(--border)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-xs uppercase tracking-[0.2em] text-[var(--accent-foreground)] font-semibold font-body mb-3">
              <Instagram className="h-3.5 w-3.5" />
              <span>Instagram Reels • @interior_points</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
              Watch Our Live Mumbai Home Reels
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed font-body">
              Click any reel below to play directly on this page or expand into our full-screen
              theater. Real on-site joinery, modular kitchens, cove false ceilings, and turnkey handovers.
            </p>
          </motion.div>

          {/* Action buttons & mode toggles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3"
          >
            {/* Live Mode Toggle */}
            <button
              type="button"
              onClick={() => setLiveModeAll((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all ${
                liveModeAll
                  ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-xs"
                  : "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{liveModeAll ? "Live Embeds: ON" : "Turn On All Live Players"}</span>
            </button>

            {/* Profile CTA */}
            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:opacity-95 hover:scale-[1.02] transition-all"
            >
              <Instagram className="h-4 w-4" />
              <span>Follow @interior_points</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>

        {/* 6-Card Instagram Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {INSTAGRAM_REELS.map((reel, index) => {
            const isPlayingInline = liveModeAll || playingInlineIds[reel.id];

            return (
              <motion.div
                key={`${reel.id}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-[var(--radius)] overflow-hidden border border-[var(--border)] bg-white text-[var(--foreground)] shadow-xs hover:shadow-lg transition-all flex flex-col"
              >
                {/* Visual / Player Container (Reel aspect) */}
                <div className="relative aspect-[4/5] sm:aspect-[9/13] w-full overflow-hidden bg-neutral-900">
                  {isPlayingInline ? (
                    // Active Instagram Embedded Player
                    <div className="w-full h-full relative bg-neutral-950 flex items-center justify-center">
                      <iframe
                        src={`https://www.instagram.com/reel/${reel.shortcode}/embed/`}
                        title={reel.title}
                        className="w-full h-full border-0"
                        allowFullScreen
                        scrolling="no"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      />
                      {/* Top Overlay controls for active embed */}
                      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => toggleInlinePlay(reel.id, e)}
                          title="Close inline player"
                          className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs backdrop-blur-md transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openReelTheater(index)}
                          title="Open Fullscreen Reel Theater"
                          className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs backdrop-blur-md transition-colors"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Poster with animated Play overlay
                    <div
                      onClick={() => openReelTheater(index)}
                      className="w-full h-full relative cursor-pointer group/poster"
                    >
                      <img
                        src={reel.previewImage}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover/poster:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover/poster:via-black/20 transition-colors duration-300" />

                      {/* Top Badge: Tag & Reel Indicator */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-wider font-semibold text-white border border-white/10">
                          {reel.tag}
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-semibold backdrop-blur-md">
                          <Play className="h-2.5 w-2.5 fill-white" />
                          <span>Reel</span>
                        </span>
                      </div>

                      {/* Center Play Button with Pulsating Rings */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="relative">
                          {/* Pulsating ring */}
                          <div className="absolute -inset-2 rounded-full bg-white/20 animate-ping opacity-60 pointer-events-none" />
                          <div className="h-14 w-14 rounded-full bg-white/95 text-neutral-900 shadow-xl flex items-center justify-center group-hover/poster:scale-110 group-hover/poster:bg-white transition-all duration-300 pl-0.5">
                            <Play className="h-6 w-6 fill-neutral-900 text-neutral-900" />
                          </div>
                        </div>
                        <span className="mt-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/10 opacity-90 group-hover/poster:opacity-100 transition-opacity">
                          Watch Reel
                        </span>
                      </div>

                      {/* Bottom Info inside the poster */}
                      <div className="absolute bottom-3 left-3 right-3 z-10 text-white flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-1 text-white/90">
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>@interior_points</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                            {reel.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5 fill-white text-white" />
                            {reel.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Editorial Footer */}
                <div className="p-4 bg-white border-t border-[var(--border)] flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--foreground)] line-clamp-1 font-display">
                      {reel.title}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mt-1 leading-relaxed font-body">
                      {reel.caption}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => toggleInlinePlay(reel.id)}
                      className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent-foreground)] hover:underline"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{isPlayingInline ? "Close Player" : "Play Inline"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openReelTheater(index)}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors"
                    >
                      <Maximize2 className="h-3 w-3" />
                      <span>Theater View</span>
                    </button>

                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--muted-foreground)] hover:text-neutral-900 transition-colors"
                      title="Open on Instagram"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner with Instagram Link & WhatsApp Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 p-6 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--secondary)] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Instagram className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--foreground)]">
                Liked any concept in our reels?
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Send us the screenshot or reel link on WhatsApp for an instant ballpark cost &amp;
                3D layout consultation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="https://wa.me/917903038750?text=Hi%20Interior%20Points%2C%20I%20saw%20your%20reels%20on%20the%20website%20and%20wanted%20to%20discuss%20a%20similar%20interior%20for%20my%20Mumbai%20flat."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>WhatsApp Design Desk (+91 7903038750)</span>
            </a>

            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[var(--border)] hover:border-[var(--accent)] text-[var(--foreground)] text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Explore All on @interior_points</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* FULL REEL THEATER MODAL (Plays live reel with vertical phone experience) */}
      <AnimatePresence>
        {selectedReelIndex !== null && selectedReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedReelIndex(null)}
          >
            {/* Modal Dialog Card */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedReelIndex(null)}
                aria-label="Close Reel Theater"
                className="absolute top-4 right-4 z-30 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={prevReel}
                aria-label="Previous Reel"
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/70 hover:bg-black text-white items-center justify-center border border-white/10 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextReel}
                aria-label="Next Reel"
                className="hidden md:flex absolute right-3 md:right-[380px] top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/70 hover:bg-black text-white items-center justify-center border border-white/10 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Left Column: Live Reel Video Frame */}
              <div className="w-full md:w-[480px] h-[520px] sm:h-[580px] md:h-[620px] bg-black flex items-center justify-center relative shrink-0 border-b md:border-b-0 md:border-r border-neutral-800">
                <iframe
                  key={selectedReel.shortcode}
                  src={`https://www.instagram.com/reel/${selectedReel.shortcode}/embed/`}
                  title={selectedReel.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />

                {/* Mobile Bottom Navigation controls */}
                <div className="md:hidden absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs z-20">
                  <button type="button" onClick={prevReel} className="flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <span className="text-white/60">
                    {selectedReelIndex + 1} / {INSTAGRAM_REELS.length}
                  </span>
                  <button type="button" onClick={nextReel} className="flex items-center gap-1">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Reel Details & Actions */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto text-white">
                <div className="space-y-6">
                  {/* Reel Creator Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-0.5">
                        <div className="h-full w-full rounded-full bg-neutral-900 flex items-center justify-center text-xs font-bold text-white">
                          IP
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-1.5">
                          <span>interior_points</span>
                          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        <div className="text-xs text-neutral-400">
                          Mumbai Architecture &amp; Interiors
                        </div>
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                      {selectedReelIndex + 1} of {INSTAGRAM_REELS.length}
                    </span>
                  </div>

                  {/* Reel Title & Scope */}
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
                      {selectedReel.tag}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white">
                      {selectedReel.title}
                    </h3>
                  </div>

                  {/* Caption */}
                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-body">
                      {selectedReel.caption}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[11px] text-neutral-400">#InteriorPoints</span>
                      <span className="text-[11px] text-neutral-400">#MumbaiInteriors</span>
                      <span className="text-[11px] text-neutral-400">#60DayDreamHome</span>
                      <span className="text-[11px] text-neutral-400">#TurnkeyInteriors</span>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                      <Heart className="h-4 w-4 text-rose-500 mx-auto mb-1 fill-rose-500" />
                      <div className="font-bold text-sm text-white">{selectedReel.likes}</div>
                      <div className="text-[10px] text-neutral-400">Likes</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                      <MessageCircle className="h-4 w-4 text-blue-400 mx-auto mb-1 fill-blue-400" />
                      <div className="font-bold text-sm text-white">{selectedReel.comments}</div>
                      <div className="text-[10px] text-neutral-400">Comments</div>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                      <Play className="h-4 w-4 text-emerald-400 mx-auto mb-1 fill-emerald-400" />
                      <div className="font-bold text-sm text-white">{selectedReel.views}</div>
                      <div className="text-[10px] text-neutral-400">Reel Views</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Modal CTA Actions */}
                <div className="pt-6 mt-6 border-t border-neutral-800 space-y-2.5">
                  <a
                    href={`https://wa.me/917903038750?text=Hi%20Interior%20Points%2C%20I%20am%20interested%20in%20a%20turnkey%20interior%20like%20this%20reel%3A%20${encodeURIComponent(
                      selectedReel.url
                    )}%20(${encodeURIComponent(selectedReel.title)})`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Enquire About This Design on WhatsApp</span>
                  </a>

                  <a
                    href={selectedReel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-700 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Open on Instagram App / Web</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
