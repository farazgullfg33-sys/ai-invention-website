"use client";

import { Bot, Check, Loader2, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type Message = {
  role: "bot" | "user";
  text: string;
};

type Lead = {
  business: string;
  name: string;
  industry: string;
  problem: string;
  email: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const businessOptions = ["AI Automation", "Chatbot", "Custom Tool", "Exploring"];
const industryOptions = ["Real Estate", "Healthcare", "E-commerce", "SaaS/Tech", "Education", "Other"];
const problemOptions = ["Get leads", "Automate support", "Save time", "Build AI app", "Not sure"];

const emptyLead: Lead = {
  business: "",
  name: "",
  industry: "",
  problem: "",
  email: "",
};

const firstMessages: Message[] = [
  { role: "bot", text: "Hi! I am the AI Invention agent. Tiny questions, big AI plans." },
  { role: "bot", text: "What brings you here?" },
];

export function LeadCaptureChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [messages, setMessages] = useState<Message[]>(firstMessages);
  const [textValue, setTextValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<number | null>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, step]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(focusTimer);
  }, [isOpen, step]);

  useEffect(() => {
    return () => {
      if (typingTimer.current) {
        window.clearTimeout(typingTimer.current);
      }
    };
  }, []);

  function queueBot(nextStep: Step, text: string) {
    setIsTyping(true);

    typingTimer.current = window.setTimeout(() => {
      setStep(nextStep);
      setMessages((current) => [...current, { role: "bot", text }]);
      setIsTyping(false);
      setTextValue("");
      setError("");
    }, 560);
  }

  function chooseBusiness(value: string) {
    if (isTyping) {
      return;
    }

    setLead((current) => ({ ...current, business: value }));
    setMessages((current) => [...current, { role: "user", text: value }]);
    queueBot(2, "Love it. What should I call you?");
  }

  function chooseIndustry(value: string) {
    if (isTyping) {
      return;
    }

    setLead((current) => ({ ...current, industry: value }));
    setMessages((current) => [...current, { role: "user", text: value }]);
    queueBot(4, "Nice. What problem should we attack first?");
  }

  function chooseProblem(value: string) {
    if (isTyping) {
      return;
    }

    setLead((current) => ({ ...current, problem: value }));
    setMessages((current) => [...current, { role: "user", text: value }]);
    queueBot(5, "Perfect. Where can the team reply?");
  }

  function submitName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = textValue.trim();

    if (!name) {
      setError("Drop your name first.");
      return;
    }

    setLead((current) => ({ ...current, name }));
    setMessages((current) => [...current, { role: "user", text: name }]);
    queueBot(3, `Great to meet you, ${name}! What industry are you in?`);
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = textValue.trim();

    if (!emailPattern.test(email)) {
      setError("That email needs a quick fix.");
      return;
    }

    setLead((current) => ({ ...current, email }));
    setMessages((current) => [...current, { role: "user", text: email }]);
    queueBot(6, "Boom. Here is your lead card before we send it.");
  }

  async function sendLead() {
    if (isSending || isSent) {
      return;
    }

    setIsSending(true);
    setError("");

    const payload = {
      ...lead,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead capture failed");
      }

      setIsSent(true);
      setMessages((current) => [...current, { role: "bot", text: "Sent! The team will follow up soon. 🚀" }]);
    } catch {
      setError("Could not send right now. Try again in a moment.");
    } finally {
      setIsSending(false);
    }
  }

  function resetChat() {
    setStep(1);
    setLead(emptyLead);
    setMessages(firstMessages);
    setTextValue("");
    setIsTyping(false);
    setIsSending(false);
    setIsSent(false);
    setError("");
  }

  return (
    <>
      <div className="lead-chat" data-open={isOpen}>
        {isOpen ? (
          <section className="lead-chat-panel" aria-label="AI agent lead capture chat">
            <header className="lead-chat-header">
              <div className="lead-chat-title">
                <span className="lead-chat-avatar" aria-hidden="true">
                  <Bot size={20} />
                  <span>🤖</span>
                </span>
                <div>
                  <strong>AI Agent Lead Bot</strong>
                  <span>
                    <Sparkles size={13} aria-hidden="true" />
                    Quick AI project match
                  </span>
                </div>
              </div>
              <button className="lead-chat-icon-button" type="button" aria-label="Close chat" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </header>

            <div className="lead-chat-messages" ref={messagesRef} aria-live="polite">
              {messages.map((message, index) => (
                <div className={`lead-chat-bubble ${message.role}`} key={`${message.role}-${index}`}>
                  {message.text}
                </div>
              ))}

              {isTyping ? (
                <div className="lead-chat-bubble bot lead-chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              ) : null}

              {step === 6 ? (
                <div className="lead-chat-summary" aria-label="Lead summary">
                  <div className="lead-chat-summary-top">
                    <span>
                      <Check size={16} aria-hidden="true" />
                    </span>
                    <strong>Ready to send</strong>
                  </div>
                  <dl>
                    <div>
                      <dt>Name</dt>
                      <dd>{lead.name}</dd>
                    </div>
                    <div>
                      <dt>Business</dt>
                      <dd>{lead.business}</dd>
                    </div>
                    <div>
                      <dt>Industry</dt>
                      <dd>{lead.industry}</dd>
                    </div>
                    <div>
                      <dt>Problem</dt>
                      <dd>{lead.problem}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{lead.email}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </div>

            <div className="lead-chat-actions">
              {step === 1 ? (
                <div className="lead-chat-options">
                  {businessOptions.map((option) => (
                    <button type="button" key={option} onClick={() => chooseBusiness(option)} disabled={isTyping}>
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}

              {step === 2 ? (
                <form className="lead-chat-form" onSubmit={submitName}>
                  <label className="lead-chat-sr-only" htmlFor="lead-chat-name">
                    Name
                  </label>
                  <input
                    id="lead-chat-name"
                    ref={inputRef}
                    value={textValue}
                    onChange={(event) => setTextValue(event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={isTyping}
                  />
                  <button type="submit" aria-label="Send name" disabled={!textValue.trim() || isTyping}>
                    <Send size={17} />
                  </button>
                </form>
              ) : null}

              {step === 3 ? (
                <div className="lead-chat-options">
                  {industryOptions.map((option) => (
                    <button type="button" key={option} onClick={() => chooseIndustry(option)} disabled={isTyping}>
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}

              {step === 4 ? (
                <div className="lead-chat-options">
                  {problemOptions.map((option) => (
                    <button type="button" key={option} onClick={() => chooseProblem(option)} disabled={isTyping}>
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}

              {step === 5 ? (
                <form className="lead-chat-form" onSubmit={submitEmail}>
                  <label className="lead-chat-sr-only" htmlFor="lead-chat-email">
                    Email
                  </label>
                  <input
                    id="lead-chat-email"
                    ref={inputRef}
                    value={textValue}
                    onChange={(event) => setTextValue(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    disabled={isTyping}
                  />
                  <button type="submit" aria-label="Send email" disabled={!textValue.trim() || isTyping}>
                    <Send size={17} />
                  </button>
                </form>
              ) : null}

              {step === 6 ? (
                <div className="lead-chat-submit-row">
                  <button className="lead-chat-secondary" type="button" onClick={resetChat} disabled={isSending}>
                    Start over
                  </button>
                  <button
                    className="lead-chat-submit"
                    type="button"
                    data-busy={isSending}
                    onClick={() => void sendLead()}
                    disabled={isSending || isSent}
                  >
                    {isSending ? <Loader2 size={17} aria-hidden="true" /> : isSent ? <Check size={17} aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
                    {isSending ? "Sending" : isSent ? "Sent" : "Send to team"}
                  </button>
                </div>
              ) : null}

              {error ? <p className="lead-chat-error">{error}</p> : null}
            </div>
          </section>
        ) : (
          <button className="lead-chat-trigger" type="button" aria-label="Open AI agent lead bot" onClick={() => setIsOpen(true)}>
            <Bot size={25} />
            <span aria-hidden="true">🤖</span>
            <Sparkles size={15} />
          </button>
        )}
      </div>

      <style>{`
        .lead-chat {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 90;
          font-family: inherit;
        }

        .lead-chat-trigger {
          position: relative;
          display: grid;
          place-items: center;
          width: 62px;
          height: 62px;
          border: 1px solid rgba(34, 211, 238, 0.55);
          border-radius: 999px;
          color: #ffffff;
          background:
            radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.28), transparent 24%),
            linear-gradient(135deg, #8b5cf6 0%, #6d28d9 52%, #22d3ee 100%);
          box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4), 0 20px 70px rgba(139, 92, 246, 0.42);
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
          animation: leadChatPulse 2.2s ease-out infinite;
        }

        .lead-chat-trigger:hover {
          transform: translateY(-3px) scale(1.03);
          border-color: rgba(125, 249, 255, 0.86);
          box-shadow: 0 0 0 10px rgba(34, 211, 238, 0.08), 0 28px 86px rgba(139, 92, 246, 0.58);
        }

        .lead-chat-trigger span {
          position: absolute;
          left: 9px;
          top: 9px;
          font-size: 1.05rem;
          line-height: 1;
        }

        .lead-chat-trigger svg:last-child {
          position: absolute;
          right: 12px;
          top: 11px;
          color: #e0faff;
        }

        .lead-chat-panel {
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          width: 372px;
          height: 560px;
          max-width: calc(100vw - 28px);
          max-height: calc(100vh - 28px);
          overflow: hidden;
          border: 1px solid rgba(34, 211, 238, 0.24);
          border-radius: 8px;
          color: #f8fbff;
          background:
            linear-gradient(140deg, rgba(139, 92, 246, 0.22), rgba(34, 211, 238, 0.08) 38%, rgba(13, 17, 23, 0.98) 72%),
            #0d1117;
          box-shadow: 0 28px 100px rgba(0, 0, 0, 0.72), 0 0 90px rgba(34, 211, 238, 0.13);
          backdrop-filter: blur(22px);
          animation: leadChatIn 190ms ease;
        }

        .lead-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px;
          border-bottom: 1px solid rgba(34, 211, 238, 0.16);
          background: rgba(13, 17, 23, 0.86);
        }

        .lead-chat-title {
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 10px;
        }

        .lead-chat-avatar {
          position: relative;
          display: inline-grid;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(34, 211, 238, 0.28);
          border-radius: 8px;
          color: #c4b5fd;
          background: rgba(139, 92, 246, 0.18);
        }

        .lead-chat-avatar span {
          position: absolute;
          right: -5px;
          bottom: -4px;
          font-size: 0.92rem;
        }

        .lead-chat-title div {
          display: grid;
          min-width: 0;
          gap: 3px;
        }

        .lead-chat-title strong {
          overflow: hidden;
          font-size: 0.96rem;
          line-height: 1.1;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .lead-chat-title div > span {
          display: inline-flex;
          align-items: center;
          min-width: 0;
          gap: 6px;
          color: #9fb3c8;
          font-size: 0.78rem;
        }

        .lead-chat-icon-button {
          display: inline-grid;
          width: 34px;
          height: 34px;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(34, 211, 238, 0.22);
          border-radius: 8px;
          color: #f8fbff;
          background: rgba(255, 255, 255, 0.045);
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease;
        }

        .lead-chat-icon-button:hover {
          border-color: rgba(34, 211, 238, 0.62);
          background: rgba(34, 211, 238, 0.1);
        }

        .lead-chat-messages {
          display: flex;
          min-height: 0;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          padding: 14px;
          background:
            linear-gradient(180deg, rgba(139, 92, 246, 0.08), transparent 22%),
            #0d1117;
          scrollbar-color: rgba(34, 211, 238, 0.46) rgba(255, 255, 255, 0.04);
        }

        .lead-chat-bubble {
          width: fit-content;
          max-width: 88%;
          padding: 10px 12px;
          border: 1px solid rgba(34, 211, 238, 0.14);
          border-radius: 8px;
          font-size: 0.93rem;
          line-height: 1.45;
          white-space: pre-wrap;
          animation: leadBubbleIn 170ms ease;
        }

        .lead-chat-bubble.bot {
          align-self: flex-start;
          color: #eef7ff;
          background: rgba(20, 27, 39, 0.92);
        }

        .lead-chat-bubble.user {
          align-self: flex-end;
          color: #ffffff;
          border-color: rgba(196, 181, 253, 0.44);
          background: linear-gradient(135deg, #8b5cf6, #22d3ee);
          box-shadow: 0 12px 34px rgba(139, 92, 246, 0.23);
        }

        .lead-chat-typing {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-width: 58px;
        }

        .lead-chat-typing span {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #22d3ee;
          animation: leadTyping 900ms ease-in-out infinite;
        }

        .lead-chat-typing span:nth-child(2) {
          animation-delay: 120ms;
        }

        .lead-chat-typing span:nth-child(3) {
          animation-delay: 240ms;
        }

        .lead-chat-actions {
          display: grid;
          gap: 10px;
          padding: 12px;
          border-top: 1px solid rgba(34, 211, 238, 0.16);
          background: rgba(13, 17, 23, 0.92);
        }

        .lead-chat-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .lead-chat-options button,
        .lead-chat-secondary,
        .lead-chat-submit {
          min-height: 38px;
          border: 1px solid rgba(34, 211, 238, 0.22);
          border-radius: 8px;
          cursor: pointer;
          font: inherit;
          font-size: 0.85rem;
          font-weight: 850;
          transition: transform 160ms ease, background 160ms ease, border-color 160ms ease, opacity 160ms ease;
        }

        .lead-chat-options button {
          padding: 0 10px;
          color: #dbf7ff;
          background: rgba(34, 211, 238, 0.075);
          text-align: left;
        }

        .lead-chat-options button:hover:not(:disabled),
        .lead-chat-secondary:hover:not(:disabled),
        .lead-chat-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: rgba(34, 211, 238, 0.62);
        }

        .lead-chat-form {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 9px;
        }

        .lead-chat-form input {
          width: 100%;
          min-width: 0;
          min-height: 42px;
          border: 1px solid rgba(34, 211, 238, 0.22);
          border-radius: 8px;
          color: #f8fbff;
          background: rgba(255, 255, 255, 0.05);
          font: inherit;
          outline: none;
          padding: 0 12px;
          transition: border-color 160ms ease, background 160ms ease;
        }

        .lead-chat-form input:focus {
          border-color: rgba(34, 211, 238, 0.66);
          background: rgba(255, 255, 255, 0.07);
        }

        .lead-chat-form button {
          display: inline-grid;
          width: 44px;
          height: 42px;
          place-items: center;
          border: 1px solid rgba(196, 181, 253, 0.36);
          border-radius: 8px;
          color: #ffffff;
          background: linear-gradient(135deg, #8b5cf6, #22d3ee);
          cursor: pointer;
          transition: opacity 160ms ease, transform 160ms ease;
        }

        .lead-chat-form button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .lead-chat-summary {
          display: grid;
          gap: 12px;
          padding: 13px;
          border: 1px solid rgba(34, 211, 238, 0.24);
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(34, 211, 238, 0.08)),
            rgba(20, 27, 39, 0.94);
          animation: leadBubbleIn 170ms ease;
        }

        .lead-chat-summary-top {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f8fbff;
          font-size: 0.93rem;
        }

        .lead-chat-summary-top span {
          display: inline-grid;
          width: 26px;
          height: 26px;
          place-items: center;
          border-radius: 8px;
          color: #051014;
          background: #22d3ee;
        }

        .lead-chat-summary dl {
          display: grid;
          gap: 8px;
          margin: 0;
        }

        .lead-chat-summary dl div {
          display: grid;
          grid-template-columns: 80px minmax(0, 1fr);
          gap: 10px;
        }

        .lead-chat-summary dt {
          color: #9fb3c8;
          font-size: 0.76rem;
          font-weight: 850;
          text-transform: uppercase;
        }

        .lead-chat-summary dd {
          min-width: 0;
          margin: 0;
          overflow-wrap: anywhere;
          color: #eef7ff;
          font-size: 0.86rem;
          font-weight: 750;
        }

        .lead-chat-submit-row {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 9px;
        }

        .lead-chat-secondary {
          color: #c9d7e5;
          background: rgba(255, 255, 255, 0.045);
        }

        .lead-chat-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #ffffff;
          background: linear-gradient(135deg, #8b5cf6, #22d3ee);
        }

        .lead-chat-submit svg {
          flex: 0 0 auto;
        }

        .lead-chat-submit[data-busy="true"] svg:first-child {
          animation: leadSpin 900ms linear infinite;
        }

        .lead-chat-options button:disabled,
        .lead-chat-form button:disabled,
        .lead-chat-secondary:disabled,
        .lead-chat-submit:disabled {
          cursor: not-allowed;
          opacity: 0.58;
        }

        .lead-chat-error {
          margin: 0;
          color: #fda4af;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .lead-chat-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @keyframes leadChatPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.36), 0 20px 70px rgba(139, 92, 246, 0.42);
          }
          70% {
            box-shadow: 0 0 0 14px rgba(34, 211, 238, 0), 0 20px 70px rgba(139, 92, 246, 0.42);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 211, 238, 0), 0 20px 70px rgba(139, 92, 246, 0.42);
          }
        }

        @keyframes leadChatIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes leadBubbleIn {
          from {
            opacity: 0;
            transform: translateY(7px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes leadTyping {
          0%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        @keyframes leadSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 440px) {
          .lead-chat {
            right: 14px;
            bottom: 14px;
            left: 14px;
          }

          .lead-chat-trigger {
            margin-left: auto;
          }

          .lead-chat-panel {
            width: 100%;
            height: min(560px, calc(100vh - 28px));
          }

          .lead-chat-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
