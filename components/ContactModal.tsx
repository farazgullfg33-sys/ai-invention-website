"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, X } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("modal-open", isOpen);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div className="contact-action-panel">
        <div>
          <span className="eyebrow">Start Here</span>
          <h3>Tell us what agent or website you need.</h3>
          <p>Open the form, send your business details, and we will review the right package for you.</p>
        </div>
        <div className="contact-action-list">
          <span>
            <CheckCircle2 aria-hidden="true" size={18} />
            2-3 business day deployment
          </span>
          <span>
            <ShieldCheck aria-hidden="true" size={18} />
            Your VPS, your documents
          </span>
          <span>
            <MessageCircle aria-hidden="true" size={18} />
            Telegram handoff included
          </span>
        </div>
        <button className="button-primary contact-open-button" onClick={() => setIsOpen(true)} type="button">
          Open Project Form
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>

      {isOpen ? (
        <div aria-labelledby="project-form-title" aria-modal="true" className="contact-modal-backdrop" onClick={() => setIsOpen(false)} role="dialog">
          <div className="contact-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="contact-modal-head">
              <div>
                <span className="eyebrow">Project Request</span>
                <h3 id="project-form-title">Get your AI agent started</h3>
              </div>
              <button aria-label="Close project form" className="contact-modal-close" onClick={() => setIsOpen(false)} type="button">
                <X aria-hidden="true" size={22} />
              </button>
            </div>
            <ContactForm />
          </div>
        </div>
      ) : null}
    </>
  );
}
