import { MessageCircle } from "lucide-react";

const defaultMessage =
  "Hi AI Invention, I want to discuss an AI agent or website package for my business.";

function getWhatsAppHref() {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+60189016974";
  const number = rawNumber.replace(/\D/g, "");

  if (!number) {
    return "/#contact";
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(defaultMessage)}`;
}

export function WhatsAppWidget() {
  const href = getWhatsAppHref();
  const isExternal = href.startsWith("https://");

  return (
    <a
      aria-label="Chat with AI Invention on WhatsApp"
      className="whatsapp-widget"
      href={href}
      rel={isExternal ? "noopener noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      <span className="whatsapp-widget-icon">
        <MessageCircle aria-hidden="true" size={22} />
      </span>
      <span className="whatsapp-widget-text">WhatsApp</span>
    </a>
  );
}
