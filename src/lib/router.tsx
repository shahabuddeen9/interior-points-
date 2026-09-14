import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  path: "/",
  navigate: () => {},
  params: {},
});

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState<string>(() => {
    return window.location.pathname || "/";
  });

  const navigate = useCallback((to: string) => {
    // Check if it's an in-page hash on the current page
    if (to.startsWith("#") || (to.startsWith("/#") && path === "/")) {
      const hash = to.replace(/^\//, "");
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (to.includes("#") && !to.startsWith("#")) {
      const [newPath, hash] = to.split("#");
      window.history.pushState({}, "", newPath);
      setPath(newPath);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return;
    }

    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [path]);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || "/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Compute params (e.g. /projects/:slug)
  const params: Record<string, string> = {};
  if (path.startsWith("/projects/") && path.length > "/projects/".length) {
    params.slug = path.replace("/projects/", "").split("/")[0];
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params }}>
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
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = useRouter();

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (!href.startsWith("http") && !href.startsWith("tel:") && !href.startsWith("mailto:")) {
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
