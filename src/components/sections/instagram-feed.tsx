import React from "react";
import { Instagram, ArrowUpRight, Heart, MessageCircle, Play, Layers } from "lucide-react";

interface InstagramPost {
  id: string;
  type: "reel" | "post" | "carousel";
  image: string;
  caption: string;
  likes: string;
  comments: string;
  tag: string;
}

const instagramPosts: InstagramPost[] = [
  {
    id: "ig-1",
    type: "reel",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    caption: "Modern German Acrylic Modular Kitchen with seamless Blum soft-close fittings and fluted profile lights. Handed over at Prestige Song of the South. ✨",
    likes: "2.4k",
    comments: "142",
    tag: "Modular Kitchen",
  },
  {
    id: "ig-2",
    type: "carousel",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    caption: "Floor-to-ceiling anti-warp wardrobe in champagne bronze finish with fluted glass doors and sensor illumination.",
    likes: "1.8k",
    comments: "89",
    tag: "Master Bedroom",
  },
  {
    id: "ig-3",
    type: "post",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    caption: "Natural teak veneer paneling meets warm 3000K recessed architectural lighting for this 3 BHK living room handover in Bengaluru.",
    likes: "3.1k",
    comments: "215",
    tag: "Living Room",
  },
  {
    id: "ig-4",
    type: "reel",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    caption: "Traditional Indian serenity meets contemporary clean lines. Custom CNC-cut brass jali pooja unit with warm backlit corian.",
    likes: "2.7k",
    comments: "168",
    tag: "Pooja Unit",
  },
  {
    id: "ig-5",
    type: "carousel",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
    caption: "Spatial breakfast bar with fluted oak island partition and seamless quartz worktops. Zero clutter, maximum utility.",
    likes: "1.5k",
    comments: "74",
    tag: "Dining & Bar",
  },
  {
    id: "ig-6",
    type: "reel",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    caption: "Behind the scenes: 100% IS 710 BWP marine ply fabrication with zero-joint German PUR edge banding. Built to last a lifetime.",
    likes: "4.2k",
    comments: "310",
    tag: "Factory Craft",
  },
];

export function InstagramFeed() {
  const instagramUrl = "https://www.instagram.com/interior_points/";

  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Instagram Identity */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[var(--border)]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
              <Instagram className="h-3.5 w-3.5" />
              <span>Instagram Gallery • @interior_points</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mt-2">
              Follow Our Daily Craft On Instagram
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed font-body">
              Live factory updates, on-site joinery walkthroughs, material swatches, and handover stories
              shared straight from our ongoing projects.
            </p>
          </div>

          {/* Profile CTA */}
          <div className="flex items-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:opacity-95 hover:scale-102 transition-all"
            >
              <Instagram className="h-4 w-4" />
              <span>Follow @interior_points</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* 6-Card Instagram Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group block relative rounded-[var(--radius)] overflow-hidden border border-[var(--border)] bg-neutral-900 text-white shadow-xs hover:shadow-md transition-all"
            >
              {/* Image Frame */}
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Top Badge: Post type */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-white border border-white/10">
                  {post.type === "reel" && (
                    <>
                      <Play className="h-3 w-3 fill-current text-white" />
                      <span>Reel</span>
                    </>
                  )}
                  {post.type === "carousel" && (
                    <>
                      <Layers className="h-3 w-3 text-white" />
                      <span>Carousel</span>
                    </>
                  )}
                  {post.type === "post" && (
                    <>
                      <Instagram className="h-3 w-3 text-white" />
                      <span>Post</span>
                    </>
                  )}
                </div>

                {/* Tag pill */}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-wider font-semibold text-white/90 border border-white/10">
                  {post.tag}
                </div>

                {/* Hover Overlay with Instagram Engagement & Direct Link */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <span className="font-semibold tracking-wide">@interior_points</span>
                    <Instagram className="h-4 w-4" />
                  </div>

                  {/* Likes & Comments Counters */}
                  <div className="flex items-center justify-center gap-6 text-white text-sm font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4 fill-white text-white" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4 fill-white text-white" />
                      {post.comments}
                    </span>
                  </div>

                  <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    <span>View on Instagram</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Caption Underneath (Clean Editorial Feel) */}
              <div className="p-4 bg-white text-[var(--foreground)] border-t border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--accent-foreground)]">
                    @interior_points
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
                    {post.likes}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed font-body">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Bar linking to Instagram */}
        <div className="mt-12 text-center pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            Follow <strong className="text-[var(--foreground)]">@interior_points</strong> for daily design tips, material insights, and completed home tours.
          </p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors"
          >
            <span>Explore All Posts On Instagram</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
