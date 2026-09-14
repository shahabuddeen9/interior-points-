import React, { useState } from "react";
import { RouterProvider, useRouter } from "./lib/router";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { ChatAssistant } from "./components/chat-assistant";
import { ConsultationModal } from "./components/consultation-modal";

// Homepage sections
import { Hero } from "./components/sections/hero";
import { About } from "./components/sections/about";
import { ProjectsPreview } from "./components/sections/projects-preview";
import { Services } from "./components/sections/services";
import { WhyChooseUs } from "./components/sections/why-choose-us";
import { Pricing } from "./components/sections/pricing";
import { Testimonials } from "./components/sections/testimonials";
import { InstagramFeed } from "./components/sections/instagram-feed";
import { ContactSection } from "./components/sections/contact";

// Dedicated pages
import { ProjectsPage } from "./components/pages/projects-page";
import { ProjectDetailPage } from "./components/pages/project-detail-page";
import { ContactPage } from "./components/pages/contact-page";
import { AdminPage } from "./components/pages/admin-page";

function MainContent() {
  const { path } = useRouter();
  const [consultationOpen, setConsultationOpen] = useState(false);

  const openConsultation = () => setConsultationOpen(true);

  // Router logic
  const renderRoute = () => {
    if (path === "/projects") {
      return <ProjectsPage />;
    }
    if (path.startsWith("/projects/")) {
      return <ProjectDetailPage onOpenConsultation={openConsultation} />;
    }
    if (path === "/contact") {
      return <ContactPage />;
    }
    if (path === "/admin") {
      return <AdminPage />;
    }

    // Default: Homepage
    return (
      <main>
        <Hero onOpenConsultation={openConsultation} />
        <About />
        <ProjectsPreview />
        <Services />
        <WhyChooseUs />
        <Pricing onOpenConsultation={openConsultation} />
        <Testimonials />
        <InstagramFeed />
        <ContactSection />
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 selection:text-[var(--foreground)]">
      {/* Persistent Site Header */}
      <SiteHeader onOpenConsultation={openConsultation} />

      {/* Main Routed Content */}
      <div className="flex-1">{renderRoute()}</div>

      {/* Persistent Site Footer */}
      <SiteFooter />

      {/* Floating Studio Concierge Desk (Direct WhatsApp, Call & Design Advice) */}
      <ChatAssistant onOpenConsultation={openConsultation} />

      {/* Quick Consultation Modal */}
      <ConsultationModal open={consultationOpen} onOpenChange={setConsultationOpen} />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <MainContent />
    </RouterProvider>
  );
}
