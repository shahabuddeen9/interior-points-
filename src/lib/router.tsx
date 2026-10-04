import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export interface RouterContextType {
  path: string;
  hash: string;
  activeSection: string;
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

// Section paths on the homepage that map directly to section IDs
const SECTION_PATH_TO_HASH: Record<string, string> = {
  "/pricing": "pricing",
  "/packages": "pricing",
  "/rates": "pricing",
  "/about": "about",
  "/story": "about",
  "/philosophy": "about",
  "/services": "services",
  "/craft": "services",
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
  "/clients": "testimonials",
};

// Reverse map: Section ID to clean canonical pathname
const HASH_TO_CLEAN_PATH: Record<string, string> = {
  pricing: "/pricing",
  about: "/about",
  services: "/services",
  "why-us": "/why-us",
  "turnkey-package": "/turnkey-package",
  "instagram-reels": "/reels",
  testimonials: "/testimonials",
  contact: "/contact",
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
  activeSection: "",
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
  const [activeSection, setActiveSection] = useState<string>(() => {
    return SECTION_PATH_TO_HASH[initial.path] || initial.hash || "";
  });
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
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(cleanId);
        if (updateUrl) {
          const cleanPath = HASH_TO_CLEAN_PATH[cleanId] || `/#${cleanId}`;
          if (window.location.pathname !== cleanPath && window.location.hash !== `#${cleanId}`) {
            window.history.pushState(null, "", cleanPath);
            setPath(cleanPath.startsWith("/") && !cleanPath.startsWith("/#") ? cleanPath : "/");
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
    setActiveSection("");
  }, []);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean; smooth?: boolean }) => {
      if (typeof window === "undefined") return;
      isNavigatingRef.current = true;

      // 1. External links or protocols
      if (
        to.startsWith("http:") ||
        to.startsWith("https:") ||
        to.startsWith("mailto:") ||
        to.startsWith("tel:") ||
        to.startsWith("wa.me")
      ) {
        window.location.href = to;
        return;
      }

      // 2. Pure in-page anchor (e.g. "#about" or "/#about")
      if (to.startsWith("#") || to.startsWith("/#")) {
        const targetId = to.replace(/^[/#]+/, "");
        const cleanPath = HASH_TO_CLEAN_PATH[targetId] || `/#${targetId}`;
        const historyMethod = options?.replace ? window.history.replaceState : window.history.pushState;
        historyMethod.call(window.history, null, "", cleanPath);

        setPath(cleanPath.startsWith("/") && !cleanPath.startsWith("/#") ? cleanPath : "/");
        setHash(targetId);
        setActiveSection(targetId);
        scrollToSection(targetId, false);
        isNavigatingRef.current = false;
        return;
      }

      // 3. Section path alias (e.g. "/pricing" or "/about") -> smooth scroll & clean path
      const normalizedTo = normalizePath(to);
      const sectionAlias = SECTION_PATH_TO_HASH[normalizedTo];
      if (sectionAlias) {
        const historyMethod = options?.replace ? window.history.replaceState : window.history.pushState;
        historyMethod.call(window.history, null, "", normalizedTo);

        setPath(normalizedTo);
        setHash(sectionAlias);
        setActiveSection(sectionAlias);
        scrollToSection(sectionAlias, false);
        isNavigatingRef.current = false;
        return;
      }

      // 4. Root "/"
      if (normalizedTo === "/") {
        const historyMethod = options?.replace ? window.history.replaceState : window.history.pushState;
        historyMethod.call(window.history, null, "", "/");
        setPath("/");
        setHash("");
        setActiveSection("");
        scrollToTop(options?.smooth ?? true);
        isNavigatingRef.current = false;
        return;
      }

      // 5. Standard dedicated page navigation (e.g. "/projects", "/book-consultation", "/contact", "/admin")
      const targetPath = normalizedTo;
      const historyMethod = options?.replace ? window.history.replaceState : window.history.pushState;
      historyMethod.call(window.history, null, "", targetPath);

      setPath(targetPath);
      setHash("");
      setActiveSection("");
      scrollToTop(options?.smooth ?? false);
      isNavigatingRef.current = false;
    },
    [scrollToSection, scrollToTop]
  );

  // Synchronize on browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const loc = getWindowLocation();
      setPath(loc.path);
      setHash(loc.hash);

      const sectionFromPath = SECTION_PATH_TO_HASH[loc.path];
      const targetSection = loc.hash || sectionFromPath;

      if (targetSection) {
        setActiveSection(targetSection);
        scrollToSection(targetSection, false);
      } else {
        setActiveSection("");
        scrollToTop(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [scrollToSection, scrollToTop]);

  // Handle initial page load section anchor or alias (e.g. direct visit to /pricing or /about)
  useEffect(() => {
    const currentPath = normalizePath(window.location.pathname);
    const initialSection = SECTION_PATH_TO_HASH[currentPath];
    const initialHash = window.location.hash.replace(/^#/, "");

    const targetSection = initialHash || initialSection;
    if (targetSection) {
      const timer = setTimeout(() => {
        scrollToSection(targetSection, false);
        setActiveSection(targetSection);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [scrollToSection]);

  // Scroll spy to detect active section when scrolling on homepage
  useEffect(() => {
    const isHomePage =
      path === "/" ||
      Boolean(SECTION_PATH_TO_HASH[path]);

    if (!isHomePage || typeof window === "undefined") return;

    const sectionIds = [
      "about",
      "services",
      "why-us",
      "turnkey-package",
      "pricing",
      "testimonials",
      "instagram-reels",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section with highest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const currentId = visible[0].target.id;
          setActiveSection(currentId);
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [path]);

  // Compute active helper
  const isActive = useCallback(
    (href: string) => {
      if (!href) return false;

      const norm = normalizePath(href);
      const isHome = path === "/" || Boolean(SECTION_PATH_TO_HASH[path]);

      // If href is a section path or hash
      const targetHash =
        SECTION_PATH_TO_HASH[norm] ||
        (href.startsWith("#") ? href.substring(1) : href.startsWith("/#") ? href.substring(2) : null);

      if (targetHash && isHome) {
        return activeSection === targetHash || hash === targetHash;
      }

      // Check root
      if (norm === "/") {
        return path === "/" && !activeSection;
      }

      // Exact path match (e.g. /projects, /contact, /book-consultation)
      return path === norm || path.startsWith(norm + "/");
    },
    [path, hash, activeSection]
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
        activeSection,
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
