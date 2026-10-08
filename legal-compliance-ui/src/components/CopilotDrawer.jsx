import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./ui/Icon";
import { ToneBadge } from "./ui/Primitives";
import { askCopilot } from "../services/assistantService";
import { usePlatformData } from "../context/PlatformDataContext";

const STARTERS = [
  "Give me an executive summary",
  "What is our compliance health?",
  "Show critical risks",
  "Where are our compliance gaps?",
  "What should we fix first?",
  "What is our maturity level?",
];

function CopilotDrawer({ open, onClose, seedQuestion, onSeedConsumed }) {
  const navigate = useNavigate();
  const { intel } = usePlatformData();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  const ask = async (question) => {
    const text = question.trim();
    if (!text || thinking) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setThinking(true);
    const answer = await askCopilot(text, intel);
    setMessages((m) => [...m, { role: "assistant", answer }]);
    setThinking(false);
  };

  useEffect(() => {
    if (open && seedQuestion) {
      ask(seedQuestion);
      onSeedConsumed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seedQuestion]);

  useEffect(() => {
    if (!messages.length) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const go = (route) => {
    navigate(route);
    onClose();
  };

  return (
    <>
      {open && <div className="drawer-backdrop no-print" onClick={onClose} />}
      <aside
        className={`copilot-drawer no-print ${open ? "open" : ""}`}
        aria-hidden={!open}
        aria-label="Compliance Copilot"
      >
        <header className="copilot-header">
          <div className="d-flex align-items-center gap-2">
            <span className="copilot-avatar">
              <Icon name="sparkle" size={16} />
            </span>
            <div>
              <div className="fw-semibold">Compliance Copilot</div>
              <div className="small text-body-secondary">
                Grounded in live platform data · cites sources
              </div>
            </div>
          </div>
          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close Copilot"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="copilot-body" ref={scrollRef}>
          {!messages.length && (
            <div className="copilot-welcome">
              <p className="small text-body-secondary">
                Ask about compliance posture, risks, gaps, maturity or a
                specific policy or regulation.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button key={s} className="chip" onClick={() => ask(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="msg msg-user">
                {m.text}
              </div>
            ) : (
              <div key={i} className="msg msg-assistant">
                <div className="fw-semibold mb-1">{m.answer.title}</div>
                {m.answer.summary.map((line, j) => (
                  <p key={j} className="mb-1 small">
                    {line}
                  </p>
                ))}
                {m.answer.items.length > 0 && (
                  <ul className="answer-items list-unstyled mt-2 mb-0">
                    {m.answer.items.map((item, j) => (
                      <li key={j} onClick={() => item.route && go(item.route)}>
                        <ToneBadge tone={item.tone}>●</ToneBadge>
                        <div className="flex-grow-1">
                          <div className="small fw-medium">{item.label}</div>
                          {item.detail && (
                            <div className="small text-body-secondary">
                              {item.detail}
                            </div>
                          )}
                        </div>
                        <Icon name="arrow" size={14} />
                      </li>
                    ))}
                  </ul>
                )}
                {m.answer.citations.length > 0 && (
                  <div className="citations mt-2">
                    <span className="small text-body-secondary me-1">
                      Sources:
                    </span>
                    {m.answer.citations.map((c, j) => (
                      <button
                        key={j}
                        className="citation"
                        onClick={() => go(c.route)}
                      >
                        [{j + 1}] {c.label}
                      </button>
                    ))}
                  </div>
                )}
                {m.answer.degraded && (
                  <div className="small text-warning mt-2">
                    RAG service unavailable — answered from local engine.
                  </div>
                )}
                {i === messages.length - 1 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {m.answer.followUps.map((f) => (
                      <button
                        key={f}
                        className="chip chip-sm"
                        onClick={() => ask(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}

          {thinking && (
            <div className="msg msg-assistant">
              <span className="typing">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
        </div>

        <form
          className="copilot-input"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            className="form-control"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Copilot…"
            aria-label="Ask the Copilot"
          />
          <button
            className="btn btn-copilot"
            type="submit"
            disabled={!input.trim() || thinking}
            aria-label="Send"
          >
            <Icon name="send" size={16} />
          </button>
        </form>
      </aside>
    </>
  );
}

export default CopilotDrawer;
