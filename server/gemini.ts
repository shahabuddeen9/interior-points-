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

const fallbackResponse = `Namaste! At Interior Points, we specialize in bespoke 1, 2, and 3 BHK home interiors with transparent itemized pricing:
• 1 BHK: Essentials ~₹4.5L - ₹5.8L | Premium ~₹6.2L - ₹7.8L
• 2 BHK: Essentials ~₹7.5L - ₹9.2L | Premium ~₹10.2L - ₹12.5L | Luxury ~₹14.5L - ₹18.0L
• 3 BHK: Essentials ~₹10.5L - ₹12.8L | Premium ~₹14.8L - ₹17.9L | Luxury ~₹21.0L - ₹26.5L

All projects include 100% IS 710 BWP marine plywood in wet zones, Blum & Hafele hardware, our 45-Day Move-in Guarantee, and a 10-year warranty.

Would you like to schedule a free 3D design consultation or review tailored material finishes?`;

export async function generateConsultationReply(
  userMessage: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  const ai = getGenAI();
  if (!ai) {
    return fallbackResponse;
  }

  const systemInstruction = `You are the Senior Design Consultation Assistant at Interior Points — a boutique interior design studio crafting bespoke 1, 2, and 3 BHK home interiors in India (Bengaluru, Mumbai, Hyderabad).
Tagline: "Designing Spaces. Creating Experiences."
Phone & WhatsApp: +91 7903038750
Instagram: @interior_points (https://www.instagram.com/interior_points/)

Your Personality & Tone:
- Premium, architectural, warm, editorial, and transparent. Not aggressive, salesy, or corporate.
- Knowledgeable about Indian BHK floorplans, modular kitchens, BWP marine plywood (IS 710), acrylic vs PU finishes, quartz countertops, Blum & Hafele hardware, cove lighting, and false ceiling aesthetics.
- Provide thoughtful, concise, well-formatted guidance (2-3 short paragraphs or clean bullet points).
- Transparent on pricing:
  - 1 BHK: Essentials ~₹4.5L - ₹5.8L | Premium ~₹6.2L - ₹7.8L
  - 2 BHK: Essentials ~₹7.5L - ₹9.2L | Premium ~₹10.2L - ₹12.5L | Luxury ~₹14.5L - ₹18.0L
  - 3 BHK: Essentials ~₹10.5L - ₹12.8L | Premium ~₹14.8L - ₹17.9L | Luxury ~₹21.0L - ₹26.5L
- Mention our 45-Day Move-in Guarantee, 10-Year Hardware Warranty, and zero-hidden-cost guarantee.
- Always conclude with a gentle recommendation to book a free 3D design consultation via the website form or WhatsApp (+91 7903038750) for a customized quotation.`;

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
