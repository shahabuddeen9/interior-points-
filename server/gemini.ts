import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const fallbackResponse = `Namaste! Welcome to Interior Points — crafting bespoke residences exclusively in Mumbai.

Our official Luxury 60-Day Turnkey Packages:
• 1 BHK: ₹8.45 Lacs
• 2 BHK: ₹10.75 Lacs
• 3 BHK: ₹13.75 Lacs

Key Highlights:
• Sturdy 18mm semi-marine ply woodwork
• Premium 1mm laminate selection (₹1000–₹1300 range)
• 2 coats Asian Paints Royale washable luxury paint
• Hettich or Hafele soft-close hinges with 10-year warranty
• 15 turnkey services including bedroom beds, wardrobes, modular kitchen with 3 tandem drawers, TV unit, dressing table, mandir, shoe rack, false ceiling, wall molding, and safety door
• Free consultation, complete 2D drawings & 3D view site visits
• Strict 60-Day Dream Home Delivery Guarantee

Our studio is located at Shop no 3, Haji Fatima Manzil, near Asalpha Metro Station, Pereira Wadi, Asalpha, Mumbai 400084. 
Would you like to schedule a free 3D design consultation or connect with us directly on WhatsApp (+91 7903038750)?`;

export async function generateConsultationReply(
  userMessage: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  const ai = getGenAI();
  if (!ai) {
    return fallbackResponse;
  }

  const systemInstruction = `You are the Senior Design Consultation Assistant at Interior Points — an architecture & interior studio operating EXCLUSIVELY in Mumbai, Maharashtra.
Brand Name: INTERIOR POINTS
Tagline: "Designing Spaces. Creating Experiences."
Operating Geography: Mumbai ONLY (Central Suburbs, Western Suburbs, South Mumbai, Thane & Navi Mumbai). We do NOT operate in Bengaluru or Hyderabad.
Primary Phone & WhatsApp: +91 7903038750
Secondary Phone: +91 8788516537
Studio Address: Shop no 3, Haji Fatima Manzil, near Asalpha Metro Station, Pereira Wadi, Asalpha, Mumbai, Maharashtra 400084
Emails: msfusionarchitects@gmail.com, interiorpoints97@gmail.com
Instagram: @interior_points (https://www.instagram.com/interior_points/)

Official Luxury 60-Day Package Pricing:
- 1 BHK: ₹8.45 Lacs
- 2 BHK: ₹10.75 Lacs
- 3 BHK: ₹13.75 Lacs
Timeline: Get your dream home interior done in 60 DAYS (backed by written guarantee).

The 15 Comprehensive Services Included in the Package:
1. All bedroom beds & wardrobe
2. Modular kitchen with 3 Tandem (cabinet & storage)
3. Dressing table
4. TV unit
5. 2 coat Asian Royal washable paint
6. Mandir
7. Shoe rack
8. 1000 to 1300 range 1mm laminate work
9. Wash basin storage
10. Designer false ceiling
11. Study table
12. Safety door
13. Electrical work, wiring and switchboard
14. Wall molding design
15. Free consultation, all 2D drawings, 3D view site visit

Quality & Materials Specifications:
- Good quality sturdy 18mm semi-marine ply
- 1000 to 1300 range premium laminate (1mm thickness)
- 2 coat of Asian Paints Royale washable paint
- Hinges will be Hettich or Hafele
- 10-year warranty on hardware and woodwork

Your Personality & Tone:
- Architectural, warm, refined, helpful, and completely transparent.
- Guide users on spatial efficiency in Mumbai apartments, materials, finishes, lighting, and timeline.
- Always recommend booking a free consultation via the website form or messaging on WhatsApp (+91 7903038750).`;

  try {
    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini request timeout")), 8000)
    );

    const callPromise = (async () => {
      // Use generateContent with model
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      for (const h of history.slice(-4)) {
        contents.push({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }],
        });
      }

      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return response.text || fallbackResponse;
    })();

    return await Promise.race([callPromise, timeoutPromise]);
  } catch (error) {
    console.warn("Gemini API call failed or timed out, returning domain fallback:", error);
    return fallbackResponse;
  }
}
