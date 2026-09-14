export type BHKType = "1 BHK" | "2 BHK" | "3 BHK" | "Penthouse" | "Villa";

export type RoomCategory = "Kitchen" | "Wardrobe" | "False Ceiling" | "Living Room" | "Full Home";

export interface Project {
  id: string;
  slug: string;
  title: string;
  bhkType: BHKType;
  roomTypes: RoomCategory[];
  location: string;
  city: string;
  coverImage: string;
  images: string[];
  scope: string[];
  timeline: string;
  budgetRange: string;
  description: string;
  featured: boolean;
  clientTestimonial?: {
    clientName: string;
    quote: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  bhkType: string;
  location: string;
  quote: string;
  rating: number;
  avatar?: string;
  date: string;
  projectSlug?: string;
}

export interface CredibilityStat {
  id: string;
  label: string;
  value: string;
  description: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  bhkType: string;
  message?: string;
  status: "new" | "contacted" | "scheduled" | "closed";
  createdAt: string;
}

export type ConsultationLead = LeadSubmission;

export interface PricingPlan {
  id: string;
  name: "Essentials" | "Premium" | "Luxury";
  tagline: string;
  startingRange: {
    "1 BHK": string;
    "2 BHK": string;
    "3 BHK": string;
  };
  features: string[];
  materials: string;
  warranty: string;
  popular?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
