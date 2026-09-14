import { Project, Testimonial, CredibilityStat, LeadSubmission, PricingPlan } from "../src/types";

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    slug: "hiranandani-powai-sanctuary",
    title: "Hiranandani Powai Sanctuary",
    bhkType: "3 BHK",
    roomTypes: ["Full Home", "Kitchen", "Wardrobe", "False Ceiling", "Living Room"],
    location: "Powai",
    city: "Mumbai",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
    ],
    scope: [
      "18mm semi-marine ply with anti-scratch 1mm laminate modular kitchen",
      "Floor-to-ceiling master wardrobe with tinted fluted glass and sensor lighting",
      "Seamless gypsum false ceiling with warm architectural cove lighting",
      "Custom fluted wood acoustic panelling behind TV console",
      "Bespoke teakwood and brass prayer niche (Pooja mandir)"
    ],
    timeline: "58 Days",
    budgetRange: "₹13.75L Package",
    description: "A refined 3 BHK residence designed with an editorial aesthetic celebrating natural light, muted oatmeal upholstery, and brushed brass trims. Every square foot maximizes functional Mumbai storage requirements without visual bulk.",
    featured: true,
    clientTestimonial: {
      clientName: "Rohan & Ananya Deshmukh",
      quote: "Interior Points brought an architectural sensibility we didn't think was possible within our budget. The kitchen finish is impeccable, and they handed over keys on day 58 within the 60-day promise."
    }
  },
  {
    id: "proj-2",
    slug: "lokhandwala-andheri-residence",
    title: "Lokhandwala Heights Residence",
    bhkType: "2 BHK",
    roomTypes: ["Full Home", "Kitchen", "Wardrobe", "Living Room"],
    location: "Andheri West",
    city: "Mumbai",
    coverImage: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
    ],
    scope: [
      "Modular kitchen with 3 Tandem drawers, cabinet & storage in 18mm semi-marine ply",
      "His & Hers sliding wardrobe with concealed dressing mirror and loft storage",
      "Cove lit false ceiling with warm 3000K indirect ambient glow",
      "Space-saving folding dining bar unit with fluted oak panelling"
    ],
    timeline: "52 Days",
    budgetRange: "₹10.75L Package",
    description: "Designed for a young Mumbai couple desiring calm, uncluttered elegance. We combined soft sage cabinetry with warm oak grains, transforming a standard builder flat into a tranquil urban sanctuary.",
    featured: true,
    clientTestimonial: {
      clientName: "Karthik & Sneha Iyer",
      quote: "Zero hidden charges. The 3D render match was beyond 95%. Their in-house factory team is remarkably skilled, polite, and delivered before 60 days."
    }
  },
  {
    id: "proj-3",
    slug: "godrej-the-trees-ghatkopar",
    title: "The Eastern Crest",
    bhkType: "3 BHK",
    roomTypes: ["Full Home", "Living Room", "False Ceiling", "Kitchen"],
    location: "Ghatkopar",
    city: "Mumbai",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80"
    ],
    scope: [
      "Smoked walnut veneer wall feature with hidden master bedroom door",
      "Parallel chef's kitchen with Hafele pull-out pantry and wicker vegetable baskets",
      "Walk-in dressing suite with glass island for accessories and velvet-lined trays",
      "Acoustic wooden slatted false ceiling with linear LED extrusions"
    ],
    timeline: "56 Days",
    budgetRange: "₹13.75L Package",
    description: "A luxurious 3 BHK apartment where bespoke smoked walnut millwork meets tactile linen textures. The floor plan was optimized to create fluid entertaining zones and intimate private quarters.",
    featured: true,
    clientTestimonial: {
      clientName: "Vikram & Radhika Nair",
      quote: "Their team took care of everything from civil modifications and electrical rewiring to the finest brass cabinet knobs. Complete peace of mind."
    }
  },
  {
    id: "proj-4",
    slug: "the-marina-crest",
    title: "The Marina Crest",
    bhkType: "2 BHK",
    roomTypes: ["Full Home", "Living Room", "Wardrobe"],
    location: "Bandra West",
    city: "Mumbai",
    coverImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80"
    ],
    scope: [
      "Curved fluted plaster finish divider with fluted glass arched doorway",
      "Compact L-shaped kitchen with quartz backsplash and concealed chimney",
      "Wall-mounted floating bed with integrated floating nightstands and brass reading sconces",
      "Smart utility balcony cabinet with concealed front-load washer-dryer bay"
    ],
    timeline: "48 Days",
    budgetRange: "₹10.75L Package",
    description: "Compact living executed with bespoke grandeur. Soft curved transitions, arched doorways, and light-reflecting ivory surfaces give this sea-breeze home an expansive, breathable vibe.",
    featured: true,
    clientTestimonial: {
      clientName: "Meera & Siddharth Sen",
      quote: "Every inch in Mumbai counts. Interior Points designed concealed storage spots we didn't even realize were possible. Truly editorial and functional."
    }
  },
  {
    id: "proj-5",
    slug: "asalpha-metro-haven",
    title: "Asalpha Metro Haven",
    bhkType: "1 BHK",
    roomTypes: ["Full Home", "Kitchen", "Living Room"],
    location: "Asalpha",
    city: "Mumbai",
    coverImage: "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4b72?auto=format&fit=crop&w=1200&q=80"
    ],
    scope: [
      "Straight-line modular kitchen with hydraulic lift-up frosted glass cabinets",
      "Multi-functional Murphy desk that converts seamlessly from work desk to dining",
      "Floor-to-ceiling sliding wardrobe with full-length mirror panel",
      "Minimal perimeter false ceiling with dimmable COB spotlights",
      "2 coats Asian Royale washable luxury paint with wall molding"
    ],
    timeline: "60 Days",
    budgetRange: "₹8.45L Package",
    description: "A compact 1 BHK executive residence near Asalpha where smart furniture and warm minimalist tones create a sophisticated home with zero wasted floor area.",
    featured: true,
    clientTestimonial: {
      clientName: "Abhishek Varman",
      quote: "As a young professional in Mumbai, I wanted quality without overpaying. Interior Points's 8.45L 1 BHK package was transparent down to the last rupee."
    }
  },
  {
    id: "proj-6",
    slug: "worli-sea-face-residence",
    title: "Worli Sea Face Residence",
    bhkType: "3 BHK",
    roomTypes: ["Full Home", "Kitchen", "Wardrobe", "False Ceiling", "Living Room"],
    location: "Worli",
    city: "Mumbai",
    coverImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    scope: [
      "Island kitchen with quartz waterfall edge and integrated breakfast counter",
      "Backlit onyx marble cladding in living foyer",
      "Walk-in wardrobe with bronze aluminium profiles and Italian sensor lights",
      "Custom upholstered king bed with fluted wood panelling and reading lights"
    ],
    timeline: "58 Days",
    budgetRange: "₹13.75L Package",
    description: "An expansive 3 BHK Mumbai home showcasing grand proportional scale, Italian Statuario accents, brushed gold hardware, and automated mood lighting schemes.",
    featured: true,
    clientTestimonial: {
      clientName: "Dr. Srinivas & Aruna Rao",
      quote: "The quality of materials, the professionalism of the site supervisor, and the design eye of Interior Points are unmatched in Mumbai."
    }
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Rohan & Ananya Deshmukh",
    bhkType: "3 BHK Residence",
    location: "Powai, Mumbai",
    quote: "Interior Points brought an architectural sensibility we didn't think was possible within our budget. The modular kitchen finish is impeccable, and they handed over keys on day 58 without any price escalation.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    date: "February 2026",
    projectSlug: "hiranandani-powai-sanctuary"
  },
  {
    id: "test-2",
    name: "Karthik & Sneha Iyer",
    bhkType: "2 BHK Flat",
    location: "Andheri West, Mumbai",
    quote: "Zero hidden charges. The 3D render match was beyond 95%. Their in-house factory team is remarkably skilled, polite, and punctual. Best decision we made for our Mumbai flat.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    date: "January 2026",
    projectSlug: "lokhandwala-andheri-residence"
  },
  {
    id: "test-3",
    name: "Meera & Siddharth Sen",
    bhkType: "2 BHK Sea-view Flat",
    location: "Bandra West, Mumbai",
    quote: "Every inch in Mumbai counts. Interior Points designed concealed storage spots we didn't even realize were possible. From the fluted glass partition to the acoustic ceiling, the craftsmanship is flawless.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    date: "December 2025",
    projectSlug: "the-marina-crest"
  },
  {
    id: "test-4",
    name: "Dr. Alok & Radhika Sharma",
    bhkType: "3 BHK Luxury Residence",
    location: "Ghatkopar East, Mumbai",
    quote: "The quality of 18mm semi-marine ply, the responsiveness of our dedicated project architect, and the overall design eye of Interior Points are truly premier. Our guests love the living room.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    date: "November 2025",
    projectSlug: "godrej-the-trees-ghatkopar"
  }
];

export const initialStats: CredibilityStat[] = [
  {
    id: "stat-1",
    value: "8+",
    label: "Years in Business",
    description: "Designing bespoke Mumbai homes with architectural rigor"
  },
  {
    id: "stat-2",
    value: "350+",
    label: "Homes Completed",
    description: "1, 2 & 3 BHK flats delivered across premier societies"
  },
  {
    id: "stat-3",
    value: "60-Day",
    label: "Dream Home Guarantee",
    description: "Strict 60-day project delivery with weekly visual progress audits"
  },
  {
    id: "stat-4",
    value: "10-Year",
    label: "Comprehensive Warranty",
    description: "Backed by authentic Hettich & Hafele hardware and sturdy 18mm ply"
  }
];

export const initialLeads: LeadSubmission[] = [
  {
    id: "lead-1",
    name: "Tanvi Saxena",
    phone: "+91 7903038750",
    email: "tanvi.saxena@example.com",
    city: "Mumbai",
    bhkType: "3 BHK",
    message: "Possession scheduled for next month in Powai. Looking for full home interiors with modular kitchen and 3 wardrobes.",
    status: "scheduled",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "lead-2",
    name: "Amitav Roy",
    phone: "+91 99201 54321",
    email: "amitav.roy@example.com",
    city: "Mumbai",
    bhkType: "2 BHK",
    message: "Interested in the 10.75L 60-day package for 2 BHK in Ghatkopar. Need quote and sample material finishes.",
    status: "new",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "plan-standard",
    name: "Essential Modular",
    tagline: "Essential modular woodwork, kitchen & wardrobes for rental or budget-conscious residences.",
    startingRange: {
      "1 BHK": "₹6.25 Lacs",
      "2 BHK": "₹8.50 Lacs",
      "3 BHK": "₹11.20 Lacs"
    },
    features: [
      "Sturdy 18mm MR grade ply with anti-bubble 0.8mm laminates",
      "Modular kitchen with soft-close tandem drawers & cutlery trays",
      "Wardrobes with internal shelves, hanging rails & locks",
      "Perimeter gypsum false ceiling with warm LED downlights",
      "Asian Paints tractor emulsion interior wall painting",
      "Electrical switchboard point adjustments & lighting fixtures",
      "Dedicated site supervisor with weekly WhatsApp photo updates"
    ],
    materials: "18mm Commercial Ply, 0.8mm Laminates, Ebco/Hettich fittings",
    warranty: "5-Year Material Warranty",
    popular: false
  },
  {
    id: "plan-signature-60day",
    name: "Luxury 60-Day Package",
    tagline: "Official Instagram package with 15 turnkey services, 18mm semi-marine ply & 60-day delivery.",
    startingRange: {
      "1 BHK": "₹8.45 Lacs",
      "2 BHK": "₹10.75 Lacs",
      "3 BHK": "₹13.75 Lacs"
    },
    features: [
      "All bedroom beds with storage & floor-to-ceiling wardrobes",
      "Modular kitchen with 3 Tandem drawers, upper cabinets & deep storage",
      "Designer dressing table with illuminated vanity mirror",
      "Sleek floating TV console unit with cable raceway",
      "2 coats of authentic Asian Paints Royale luxury washable paint",
      "Custom devotional Mandir unit with brass accents",
      "Dedicated shoe rack unit at entryway",
      "Premium ₹1000–₹1300 range 1mm laminate selection",
      "Wash basin vanity & bathroom storage cabinet",
      "Full designer gypsum false ceiling with ambient cove lighting",
      "Ergonomic study table / work-from-home desk",
      "Safety door with heavy-duty locks & peephole",
      "Complete electrical work, rewiring and modular switchboards",
      "Architectural wall molding design for aesthetic depth",
      "Free 1-on-1 consultation, complete 2D drawings & 3D view site visits"
    ],
    materials: "Sturdy 18mm Semi-Marine Ply, 1mm Laminate (₹1000-1300 range), Hettich / Hafele Hinges, 2-Coat Asian Royale",
    warranty: "10-Year Warranty • 60-Day Handover Guarantee",
    popular: true
  },
  {
    id: "plan-elite-bespoke",
    name: "Elite Architectural",
    tagline: "Ultra-luxury residences with natural Italian veneers, quartz waterfall counters & automation.",
    startingRange: {
      "1 BHK": "₹11.50 Lacs",
      "2 BHK": "₹15.80 Lacs",
      "3 BHK": "₹19.50 Lacs"
    },
    features: [
      "Natural smoked Italian walnut/oak veneer with polyurethane (PU) matte polish",
      "Island modular kitchen with waterfall quartz edges & integrated breakfast counter",
      "Walk-in wardrobe suite with tinted bronze aluminium profiles & custom island dresser",
      "Italian Statuario marble feature wall in foyer and living area",
      "Smart ambient lighting automation (dimming, mood presets & app control)",
      "Bespoke dining table, master bed frame with custom headboard upholstery",
      "Full civil re-modelling, plumbing re-routing & bathroom revamps included",
      "Senior Principal Architect oversight with 3D VR walkthrough before execution"
    ],
    materials: "Imported Smoked Veneer, Natural Italian Marble, Blum Aventos, Smart Automation",
    warranty: "10-Year Comprehensive Warranty & Lifetime Support",
    popular: false
  }
];
