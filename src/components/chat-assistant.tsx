import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Loader2, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { ChatMessage } from "../types";

const initialAssistantMessage: ChatMessage = {
  id: "welcome-1",
  role: "assistant",
  content:
    "Namaste! Welcome to Interior Points. I am your studio design assistant. Whether you are exploring floorplans for a 1, 2, or 3 BHK, weighing acrylic versus PU modular finishes, or seeking transparent budget estimates, I am here to help.",
  timestamp: "Just now",
};

const quickSuggestions = [
  "Ballpark cost for a 2 BHK in Bengaluru?",
  "Acrylic vs PU finish for modular kitchens?",
  "How does the 45-day move-in guarantee work?",
  "What is included in the 3 BHK Luxury tier?",
];

export function ChatAssistant({ onOpenConsultation }: { onOpenConsultation?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      const json = await res.json();
      const replyContent =
        json.reply ||
        "Our design team is on standby to help you plan your home. Please feel free to book a complimentary 3D consultation or reach out directly on WhatsApp!";

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: "assistant",
        content:
          "Our design studio provides turnkey bespoke interiors with a 45-day handover guarantee and transparent itemized pricing. Feel free to book a free design consultation via the form on this page or WhatsApp us directly!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Discreet, elegant floating trigger pill */}
      {!isOpen && (
        <div className="fixed bottom-6 right-5 sm:right-7 z-40 flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg hover:shadow-xl hover:bg-neutral-800 active:scale-95 transition-all text-xs font-medium tracking-wide"
            aria-label="Open Studio Concierge"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
            </span>
            <MessageSquare className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Studio Concierge</span>
          </button>
        </div>
      )}

      {/* Floating Concierge & Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-7 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[560px] max-h-[85vh] bg-white rounded-[var(--radius)] border border-[var(--border)] shadow-xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="bg-[var(--secondary)]/60 px-4 py-3.5 flex items-center justify-between border-b border-[var(--border)]">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-display font-semibold text-xs tracking-wider">
                IP
              </div>
              <div>
                <h3 className="font-display text-base font-semibold tracking-wide text-[var(--foreground)]">
                  Interior Points Concierge
                </h3>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Architectural advice, BHK budgets & instant contact
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Close Chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Direct Channel Links (Human & accessible) */}
          <div className="px-3.5 py-2 bg-neutral-50/80 border-b border-[var(--border)]/70 flex items-center justify-between text-xs text-[var(--muted-foreground)] gap-2">
            <a
              href="https://wa.me/917903038750?text=Hello%20Interior%20Points,%20I%20would%20like%20to%20consult%20on%20my%20home%20interiors."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--border)] hover:text-[#128C7E] hover:border-[#25D366] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
              <span className="font-medium text-[11px]">WhatsApp</span>
            </a>
            <a
              href="tel:+917903038750"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--border)] hover:text-[var(--foreground)] transition-colors"
            >
              <Phone className="h-3 w-3 text-[var(--accent)]" />
              <span className="font-medium text-[11px]">+91 7903038750</span>
            </a>
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenConsultation) onOpenConsultation();
              }}
              className="text-[11px] font-medium text-[var(--accent-foreground)] hover:underline"
            >
              Book 3D Visit
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-6 w-6 rounded-full bg-[var(--secondary)] border border-[var(--border)] flex items-center justify-center text-[10px] font-display font-bold text-[var(--foreground)] shrink-0 mt-0.5">
                    N
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-[var(--radius)] px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--secondary)]/40 text-[var(--foreground)] whitespace-pre-wrap"
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.role === "user" ? "text-white/60" : "text-[var(--muted-foreground)]"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="h-6 w-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-[var(--muted-foreground)] pl-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent)]" />
                <span>Preparing design advice...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested architectural topics */}
          {messages.length <= 3 && (
            <div className="px-3 py-2 bg-neutral-50 border-t border-[var(--border)]/70 flex gap-1.5 overflow-x-auto text-[11px]">
              {quickSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full border border-[var(--border)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors text-[var(--foreground)]"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input field */}
          <div className="p-3 bg-white border-t border-[var(--border)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about 2 BHK budgets, acrylic finishes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 h-9 rounded-md border border-[var(--border)] px-3 text-xs focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-9 w-9 rounded-md bg-[var(--primary)] text-white flex items-center justify-center hover:bg-black disabled:opacity-40 transition-colors shrink-0"
                aria-label="Send Message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
