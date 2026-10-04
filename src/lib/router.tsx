import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export interface RouterContextType {
  path: string;
  hash: string;
  params: Record<string, string>;
  navigate: (to: string, options?: { replace?: boolean; smooth?: boolean }) => void;
  isActive: (href: string) => boolean;
  scrollToSection: (sectionId: string, updateUrl?: boolean) => boolean;
  scrollToTop: (smooth?: boolean) => void;
}

// Canonical route alias mapping for smooth, user-friendly URLs
const CANONICAL_ALIASES: Record<string, string> = {
  "/estimator": "/book-consultation",
  "/cost-estimator": "/book-consultation",
  "/calculator": "/book-consultation",
  "/consultation": "/book-consultation",
  "/quote": "/book-consultation",
  "/estimate": "/book-consultation",
  "/portfolio": "/projects",
  "/works": "/projects",
  "/gallery": "/projects",
  "/login": "/admin",
  "/dashboard": "/admin",
  "/inquiry": "/contact",
  "/reach-us": "/contact",
};

// Section paths on the homepage that can be accessed directly as top-level paths (e.g. /pricing -> /#pricing)
const SECTION_PATH_TO_HASH: Record<string, string> = {
  "/pricing": "pricing",
  "/packages": "pricing",
  "/rates": "pricing",
  "/about": "about",
  "/story": "about",
  "/services": "services",
  "/why-us": "why-us",
  "/why-choose-us": "why-us",
  "/guarantee": "why-us",
  "/warranty": "why-us",
  "/turnkey": "turnkey-package",
  "/turnkey-package": "turnkey-package",
  "/package": "turnkey-package",
  "/brochure": "turnkey-package",
  "/15-points": "turnkey-package",
  "/reels": "instagram-reels",
  "/instagram": "instagram-reels",
  "/instagram-reels": "instagram-reels",
  "/testimonials": "testimonials",
  "/reviews": "testimonials",
};

function normalizePath(rawPath: string): string {
  if (!rawPath) return "/";
  // Remove query parameters or hash from path portion
  const pathOnly = rawPath.split("?")[0].split("#")[0].trim().toLowerCase();
  // Strip trailing slashes unless it is root "/"
  const stripped = pathOnly.replace(/\/+$/, "");
  const normalized = stripped === "" ? "/" : stripped;
  return CANONICAL_ALIASES[normalized] || normalized;
}

function getWindowLocation() {
  if (typeof window === "undefined") {
    return { path: "/", hash: "" };
  }
  const normalized = normalizePath(window.location.pathname);
  const currentHash = window.location.hash.replace(/^#/, "");
  return { path: normalized, hash: currentHash };
}

const RouterContext = createContext<RouterContextType>({
  path: "/",
  hash: "",
  params: {},
  navigate: () => {},
  isActive: () => false,
  scrollToSection: () => false,
  scrollToTop: () => {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const initial = getWindowLocation();
  const [path, setPath] = useState<string>(initial.path);
  const [hash, setHash] = useState<string>(initial.hash);
  const isNavigatingRef = useRef(false);

  // Smoothly scrolls to an on-page section by ID with retries if the component is still mounting
  const scrollToSection = useCallback((sectionId: string, updateUrl = true): boolean => {
    if (typeof window === "undefined") return false;
    const cleanId = sectionId.replace(/^[/#]+/, "");
    if (!cleanId) return false;

    let attempts = 0;
    const maxAttempts = 15; // retry for up to ~1.2s while React renders

    const tryScroll = () => {
      const el = document.getElementById(cleanId);
      if (el) {
        // Use scrollIntoView with CSS scroll-padding-top defined in index.css
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (updateUrl) {
          const newUrl = `/#${cleanId}`;
          if (window.location.hash !== `#${cleanId}`) {
            window.history.pushState(null, "", newUrl);
          }
          setHash(cleanId);
        }
        return true;
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 70);
      }
      return false;
    };

    return tryScroll();
  }, []);

  const scrollToTop = useCallback((smooth = true) => {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean; smooth?: boolean }) => {
      if (typeof window === "undefined") return;
      isNavigatingRef.current = true;

      // 1. External links or protocols
      if (to.startsWith("http:") || to.startsWith("https:") || to.startsWith("mailto:") || to.startsWith("tel:") || to.startsWith("wa.me")) {
        window.location.href = to;
        return;
      }

      // 2. Pure in-page anchor (e.g. "#about")
      if (to.startsWith("#")) {
        const targetId = to.substring(1);
        if (path === "/") {
          scrollToSection(targetId, true);
        } else {
          // Switch to home and scroll to section
          const targetUrl = `/#${targetId}`;
          window.history.pushState(null, "", targetUrl);
          setPath("/");
          setHash(targetId);
          scrollToSection(targetId, false);
        }
        isNavigatingRef.current = false;
        return;
      }

      // 3. Anchor with home prefix (e.g. "/#about")
      if (to.startsWith("/#")) {
        const targetId = to.substring(2);
        if (path === "/") {
          scrollToSection(targetId, true);
        } else {
          window.history.pushState(null, "", to);
          setPath("/");
          setHash(targetId);
          scrollToSection(targetId, false);
        }
        isNavigatingRef.current = false;
        return;
      }

      // 4. Check if 'to' is a section path alias (e.g. "/pricing" -> scroll to #pricing on homepage)
      const normalizedTo = normalizePath(to);
      const sectionAlias = SECTION_PATH_TO_HASH[normalizedTo];
      if (sectionAlias) {
        if (path === "/") {
          scrollToSection(sectionAlias, true);
        } else {
          window.history.pushState(null, "", `/#${sectionAlias}`);
          setPath("/");
          setHash(sectionAlias);
          scrollToSection(sectionAlias, false);
        }
        isNavigatingRef.current = false;
        return;
      }

      // 5. Standard path navigation (e.g. "/projects", "/book-consultation", "/admin")
      const targetPath = normalizedTo;
      const historyMethod = options?.replace ? window.history.replaceState : window.history.pushState;
      historyMethod.call(window.history, null, "", targetPath);

      setPath(targetPath);
      setHash("");
      scrollToTop(options?.smooth ?? false);
      isNavigatingRef.current = false;
    },
    [path, scrollToSection, scrollToTop]
  );

  // Synchronize on browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const loc = getWindowLocation();
      setPath(loc.path);
      setHash(loc.hash);

      if (loc.hash) {
        scrollToSection(loc.hash, false);
      } else {
        scrollToTop(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [scrollToSection, scrollToTop]);

  // Handle initial page load anchor or section alias (e.g. direct visit to /#turnkey-package or /pricing)
  useEffect(() => {
    const currentPath = normalizePath(window.location.pathname);
    const initialSection = SECTION_PATH_TO_HASH[currentPath];
    const initialHash = window.location.hash.replace(/^#/, "");

    const targetSection = initialHash || initialSection;
    if (targetSection) {
      // Allow DOM to settle, then scroll smoothly
      const timer = setTimeout(() => {
        scrollToSection(targetSection, !initialHash);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [scrollToSection]);

  // Compute active helper
  const isActive = useCallback(
    (href: string) => {
      if (!href) return false;
      if (href.startsWith("#") || href.startsWith("/#")) {
        const targetId = href.replace(/^[/#]+/, "");
        return path === "/" && hash === targetId;
      }
      const norm = normalizePath(href);
      return path === norm;
    },
    [path, hash]
  );

  // Compute params (e.g. /projects/:slug or /portfolio/:slug)
  const params: Record<string, string> = {};
  if (
    (path.startsWith("/projects/") && path.length > "/projects/".length) ||
    (path.startsWith("/portfolio/") && path.length > "/portfolio/".length) ||
    (path.startsWith("/works/") && path.length > "/works/".length)
  ) {
    const segments = path.split("/").filter(Boolean);
    if (segments.length >= 2) {
      params.slug = decodeURIComponent(segments[1]);
    }
  }

  return (
    <RouterContext.Provider
      value={{
        path,
        hash,
        params,
        navigate,
        isActive,
        scrollToSection,
        scrollToTop,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({
  href,
  children,
  className = "",
  onClick,
  target,
  rel,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = useRouter();

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("wa.me") ||
    target === "_blank";

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={isExternal && !rel ? "noreferrer" : rel}
      onClick={(e) => {
        if (!isExternal && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
          navigate(href);
        }
        if (onClick) onClick(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
