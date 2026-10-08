import { Project, Testimonial, CredibilityStat, LeadSubmission, PricingPlan, InstagramReel, EstimatorSpace } from "../src/types";

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
    name: "Premium Styling (60-Day)",
    tagline: "Get your dream home interior done in 60 days! Complete 15-service turnkey package with premium materials.",
    startingRange: {
      "1 BHK": "₹8.45 Lacs",
      "2 BHK": "₹10.75 Lacs",
      "3 BHK": "₹13.75 Lacs"
    },
    features: [
      "1. All Bedroom Beds and Wardrobes",
      "2. Modular Kitchen with 3 Tandem (Cabinets & Storage)",
      "3. Dressing Table",
      "4. TV Unit",
      "5. 2 Coat Asian Royal Paint",
      "6. Mandir",
      "7. Shoes Rack",
      "8. Laminate Work (1mm Thickness, ₹1000–₹1300 Range)",
      "9. Wash Basin Storage",
      "10. False Ceiling",
      "11. Study Table",
      "12. Safety Door",
      "13. Electrical Work, Wiring, & Switchboard",
      "14. Wall Molding Design",
      "15. Free Consultation (all 2D drawings, 3D view, site visit)"
    ],
    materials: "Sturdy 18mm Semi Marin Ply, 1mm Laminate (₹1000-1300 range), 2 Coat Asian Royal Paint, Hettich or Hafele Hinges",
    warranty: "10 Year Warranty • 60-Day Dream Home Guarantee",
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

export const initialReels: InstagramReel[] = [
  {
    id: "reel-1",
    shortcode: "DacMIXrvQ3F",
    url: "https://www.instagram.com/reel/DacMIXrvQ3F/",
    tag: "Site Process & Civil",
    title: "Behind-the-Scenes Site Transformation",
    caption:
      "Trust the process. 🛠️✨ Behind every beautiful home is a messy, chaotic, and exciting site phase. Master craftsmen at work across Mumbai residences.",
    likes: "85K",
    comments: "84",
    views: "120k+",
    previewImage: "/uploads/reels/DacMIXrvQ3F.jpg",
  },
  {
    id: "reel-2",
    shortcode: "DbU1nauIMph",
    url: "https://www.instagram.com/reel/DbU1nauIMph/",
    tag: "Turnkey Transformation",
    title: "Full Home Interior: Raw to Refined",
    caption:
      "Trust the process. 🛠️✨ Behind every beautiful home is a messy, chaotic, and incredibly exciting site phase. Save this for your future home inspiration! 📌 Complete turnkey fit-outs delivered across Mumbai & Thane.",
    likes: "4.1k",
    comments: "32",
    views: "58.4k",
    previewImage: "/uploads/reels/DbU1nauIMph.jpg",
  },
  {
    id: "reel-3",
    shortcode: "DcDL66_vzAi",
    url: "https://www.instagram.com/reel/DcDL66_vzAi/",
    tag: "Turnkey Transformation",
    title: "Raw to Refined: Full Interior Makeover",
    caption:
      "Trust the process. 🛠️✨ Save this for your future home inspiration! 📌 Transform your space with us. Complete turnkey fit-outs delivered with architectural rigor in Mumbai.",
    likes: "108",
    comments: "17",
    views: "18.2k",
    previewImage: "/uploads/reels/DcDL66_vzAi.jpg",
  },
  {
    id: "reel-4",
    shortcode: "DdVlWmnodc0",
    url: "https://www.instagram.com/reel/DdVlWmnodc0/",
    tag: "Execution & Site Quality",
    title: "Heart Into Every Corner: Site Progress",
    caption:
      "Trust the process. 🛠️✨ We are putting our heart into every single corner of this space. Residential, commercial, industrial turnkey interior specialists in Mumbai.",
    likes: "17",
    comments: "7",
    views: "9.5k",
    previewImage: "/uploads/reels/DdVlWmnodc0.jpg",
  },
  {
    id: "reel-5",
    shortcode: "DYgtHNXKK1d",
    url: "https://www.instagram.com/reel/DYgtHNXKK1d/",
    tag: "Luxury Living Design",
    title: "Luxury Isn't Just Designed — It's Engineered",
    caption:
      "Luxury isn't just designed — it's engineered on-site. 📐 True premium interiors are defined by seamless execution and flawless tolerances.",
    likes: "33",
    comments: "5",
    views: "14.1k",
    previewImage: "/uploads/reels/DYgtHNXKK1d.jpg",
  },
  {
    id: "reel-6",
    shortcode: "DX0zUshor7-",
    url: "https://www.instagram.com/reel/DX0zUshor7-/",
    tag: "Modular Kitchen",
    title: "Raw Studs to Culinary Sanctuary",
    caption:
      "The beauty is in the journey. 🛠️➡️🍸 We took this space from raw studs and sawdust to a sophisticated culinary sanctuary with 18mm semi-marine ply & 3 tandem drawers.",
    likes: "19",
    comments: "8",
    views: "12.8k",
    previewImage: "/uploads/reels/DX0zUshor7-.jpg",
  },
  {
    id: "reel-7",
    shortcode: "DdQbt1Eo57d",
    url: "https://www.instagram.com/reel/DdQbt1Eo57d/",
    tag: "Master Joinery & Wardrobes",
    title: "Precision Carpentry & 18mm Marine Ply",
    caption:
      "Trust the process. 🛠️✨ Behind every seamless wardrobe and floating TV unit is precision carpentry, zero-gap PUR edge banding, and genuine Hettich/Hafele hardware.",
    likes: "24",
    comments: "8",
    views: "15.6k",
    previewImage: "/uploads/reels/DdQbt1Eo57d.jpg",
  },
  {
    id: "reel-8",
    shortcode: "Dc5QmjJoav5",
    url: "https://www.instagram.com/reel/Dc5QmjJoav5/",
    tag: "Ceiling & Living Aesthetics",
    title: "Architectural Lighting & Gypsum Ceiling",
    caption:
      "Trust the process. 🛠️✨ Architectural cove false ceiling with warm 3000K recessed lighting, custom fluted panelling, and 2 coats of Asian Paints Royale washable finish.",
    likes: "40",
    comments: "16",
    views: "22.3k",
    previewImage: "/uploads/reels/Dc5QmjJoav5.jpg",
  },
];

export const initialEstimatorSpaces: EstimatorSpace[] = [
  {
    id: "kitchen",
    name: "Modular Kitchen",
    category: "Cooking Sanctuary",
    iconName: "ChefHat",
    tagline: "18mm Marine Ply, Anti-scratch Acrylic & Blum Tandem Drawers",
    specs: [
      "L-shape / Parallel layout with Kalinga Quartz or Granite countertop",
      "Cutlery, thali & bottle pull-out organizers",
      "Soft-close tandem drawers & hydraulic overhead lift-ups",
      "Under-cabinet warm 3000K task lighting profiles",
    ],
    popular: true,
    enabled: true,
    order: 1,
    pricing: {
      "1 BHK": { min: 140000, max: 165000, label: "₹1.40L – ₹1.65L" },
      "2 BHK": { min: 185000, max: 220000, label: "₹1.85L – ₹2.20L" },
      "3 BHK": { min: 240000, max: 285000, label: "₹2.40L – ₹2.85L" },
      "4 BHK / Villa": { min: 295000, max: 350000, label: "₹2.95L – ₹3.50L" },
    },
  },
  {
    id: "wardrobes",
    name: "Wardrobes & Joinery",
    category: "Master Bedrooms",
    iconName: "DoorOpen",
    tagline: "Floor-to-Ceiling Wardrobes with Concealed Lofts & Sensor Lights",
    specs: [
      "Sliding or hinged doors with zero-gap PUR edge banding",
      "Matte PU / Tinted fluted glass finish with bronze profiles",
      "Internal sensor LED profiles and digital locker drawers",
      "18mm marine grade ply with 10-year hardware warranty",
    ],
    popular: true,
    enabled: true,
    order: 2,
    pricing: {
      "1 BHK": { min: 85000, max: 105000, label: "₹85k – ₹1.05L (1 Unit)" },
      "2 BHK": { min: 160000, max: 195000, label: "₹1.60L – ₹1.95L (2 Units)" },
      "3 BHK": { min: 235000, max: 285000, label: "₹2.35L – ₹2.85L (3 Units)" },
      "4 BHK / Villa": { min: 310000, max: 375000, label: "₹3.10L – ₹3.75L (4 Units)" },
    },
  },
  {
    id: "living_tv",
    name: "Living Room & TV Console",
    category: "Entertainment",
    iconName: "Tv",
    tagline: "Floating TV Console, Fluted Acoustic Wood & Foyer Divider",
    specs: [
      "Bespoke CNC fluted panelling with hidden master bedroom door",
      "Floating drawer unit with concealed wire conduits",
      "Foyer shoe cabinet with integrated seating cushion",
      "Champagne brass trims & low-glare display niches",
    ],
    popular: false,
    enabled: true,
    order: 3,
    pricing: {
      "1 BHK": { min: 55000, max: 70000, label: "₹55k – ₹70k" },
      "2 BHK": { min: 95000, max: 120000, label: "₹95k – ₹1.20L" },
      "3 BHK": { min: 145000, max: 180000, label: "₹1.45L – ₹1.80L" },
      "4 BHK / Villa": { min: 195000, max: 240000, label: "₹1.95L – ₹2.40L" },
    },
  },
  {
    id: "ceiling_lighting",
    name: "False Ceiling & Lighting",
    category: "Atmosphere",
    iconName: "SunMedium",
    tagline: "Saint-Gobain Gypsum with Warm 3000K Indirect Cove Glow",
    specs: [
      "Zero-crack GI channel framing across living & bedrooms",
      "Indirect perimeter cove lighting with uniform warm glow",
      "Architectural magnetic track lights & COB low-glare spots",
      "Fan point re-routing and concealed wiring integration",
    ],
    popular: false,
    enabled: true,
    order: 4,
    pricing: {
      "1 BHK": { min: 40000, max: 50000, label: "₹40k – ₹50k" },
      "2 BHK": { min: 70000, max: 88000, label: "₹70k – ₹88k" },
      "3 BHK": { min: 105000, max: 130000, label: "₹1.05L – ₹1.30L" },
      "4 BHK / Villa": { min: 140000, max: 175000, label: "₹1.40L – ₹1.75L" },
    },
  },
  {
    id: "painting",
    name: "Luxury Painting & Moldings",
    category: "Surfaces",
    iconName: "Paintbrush",
    tagline: "Asian Paints Royale Luxury Washable Emulsion & Wall Moldings",
    specs: [
      "Complete surface acrylic putty levelling & sanding",
      "2 coats Asian Paints Royale luxury washable emulsion",
      "French-inspired neo-classical wall trim moldings",
      "Accent color wall or tactile microcement texture",
    ],
    popular: false,
    enabled: true,
    order: 5,
    pricing: {
      "1 BHK": { min: 35000, max: 45000, label: "₹35k – ₹45k" },
      "2 BHK": { min: 60000, max: 75000, label: "₹60k – ₹75k" },
      "3 BHK": { min: 85000, max: 105000, label: "₹85k – ₹1.05L" },
      "4 BHK / Villa": { min: 115000, max: 145000, label: "₹1.15L – ₹1.45L" },
    },
  },
  {
    id: "bathroom_civil",
    name: "Bathroom & Civil Revamp",
    category: "Sanitary & Civil",
    iconName: "Bath",
    tagline: "Vitrified Tile Cladding, Vanity Counter & Grohe/Kohler Diverters",
    specs: [
      "Quartz counter with under-counter basin & mirror cabinet",
      "Wall-hung WC with concealed dual-flush cistern",
      "Complete water-proofing with 5-year guarantee",
      "Concealed plumbing and premium matte black / chrome fittings",
    ],
    popular: false,
    enabled: true,
    order: 6,
    pricing: {
      "1 BHK": { min: 50000, max: 65000, label: "₹50k – ₹65k (1 Bath)" },
      "2 BHK": { min: 85000, max: 110000, label: "₹85k – ₹1.10L (2 Baths)" },
      "3 BHK": { min: 125000, max: 155000, label: "₹1.25L – ₹1.55L (3 Baths)" },
      "4 BHK / Villa": { min: 165000, max: 210000, label: "₹1.65L – ₹2.10L (4 Baths)" },
    },
  },
  {
    id: "furniture_decor",
    name: "Loose Furniture & Mandir",
    category: "Furnishings",
    iconName: "Armchair",
    tagline: "Custom Upholstered Sofa, Dining Table & Teak Pooja Mandir",
    specs: [
      "Custom 3+2 high-density foam sofa in spill-resistant fabric",
      "Solid ashwood or quartz 4/6 seater dining table with chairs",
      "Bespoke teakwood and brass accent Pooja Mandir niche",
      "Master bed frame with plush fabric headboard panelling",
    ],
    popular: false,
    enabled: true,
    order: 7,
    pricing: {
      "1 BHK": { min: 55000, max: 75000, label: "₹55k – ₹75k" },
      "2 BHK": { min: 95000, max: 130000, label: "₹95k – ₹1.30L" },
      "3 BHK": { min: 145000, max: 190000, label: "₹1.45L – ₹1.90L" },
      "4 BHK / Villa": { min: 195000, max: 250000, label: "₹1.95L – ₹2.50L" },
    },
  },
  {
    id: "electrical_smart",
    name: "Electrical & Smart Wiring",
    category: "Automation & Power",
    iconName: "Zap",
    tagline: "Concealed Polycab Conduits, Legrand/Schneider Modular Switches & Smart Relays",
    specs: [
      "Complete concealed copper wiring with individual MCB distribution",
      "Legrand Arteor / Schneider Opale modular switchplates",
      "Smart WiFi scene controllers & two-way bed switches",
      "AC, geyser & high-load kitchen appliance dedicated lines",
    ],
    popular: false,
    enabled: true,
    order: 8,
    pricing: {
      "1 BHK": { min: 25000, max: 35000, label: "₹25k – ₹35k" },
      "2 BHK": { min: 45000, max: 60000, label: "₹45k – ₹60k" },
      "3 BHK": { min: 70000, max: 90000, label: "₹70k – ₹90k" },
      "4 BHK / Villa": { min: 95000, max: 125000, label: "₹95k – ₹1.25L" },
    },
  },
  {
    id: "flooring_tiling",
    name: "Flooring & Italian Marble Polish",
    category: "Floors & Polish",
    iconName: "Layers",
    tagline: "High-Gloss Vitrified Tiles / Italian Marble Diamond Polish & Skirting",
    specs: [
      "Seamless vitrified tile installation with 2mm epoxy spacers",
      "Multi-stage diamond pad polish with anti-stain crystallizer",
      "Flush hardwood or brass transition thresholds",
      "Matching 4-inch perimeter wall skirting",
    ],
    popular: false,
    enabled: true,
    order: 9,
    pricing: {
      "1 BHK": { min: 30000, max: 42000, label: "₹30k – ₹42k" },
      "2 BHK": { min: 55000, max: 72000, label: "₹55k – ₹72k" },
      "3 BHK": { min: 85000, max: 110000, label: "₹85k – ₹1.10L" },
      "4 BHK / Villa": { min: 120000, max: 155000, label: "₹1.20L – ₹1.55L" },
    },
  },
  {
    id: "molding",
    name: "French Wall Moldings & Panelling",
    category: "Surface & Wall Art",
    iconName: "Paintbrush",
    tagline: "Custom French Neo-Classical Trims, Non-Yellowing Polyurethane Finish & Seamless Edge Guarantee",
    specs: [
      "French-inspired neo-classical precision wall trim moldings",
      "Dual coat premium enamel on architectural trims",
      "Molding pre-treatment, anti-crack joint concealment & primer",
    ],
    popular: false,
    enabled: true,
    order: 10,
    pricing: {
      "1 BHK": { min: 30000, max: 35000, label: "₹30k – ₹35k" },
      "2 BHK": { min: 50000, max: 60000, label: "₹50k – ₹60k" },
      "3 BHK": { min: 70000, max: 80000, label: "₹70k – ₹80k" },
      "4 BHK / Villa": { min: 105000, max: 115000, label: "₹1.05L – ₹1.15L" },
    },
  },
];

