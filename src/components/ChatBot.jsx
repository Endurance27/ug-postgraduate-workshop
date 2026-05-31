import { useState, useEffect, useRef } from "react";

const FAQ = [
  {
    patterns: ["register", "sign up", "sign-up", "how to join", "join", "enrol", "enroll"],
    answer: "Registration is **now open!** 🎉\n\nVisit the **Register** page and fill in your details. The registration fee is **GHS 100**, which covers snacks, water, and all workshop materials.\n\nDeadline to submit your abstract is **31 July 2026**.",
    quick: ["What's the fee?", "Who can register?", "Submission deadline?"],
  },
  {
    patterns: ["fee", "cost", "price", "ghs", "pay", "payment", "how much"],
    answer: "The registration fee is **GHS 100** 💳\n\nThis covers:\n• Refreshments & snacks\n• Workshop materials\n• Certificate of participation\n\nPayment is made during the registration process.",
    quick: ["How do I register?", "What's included?", "Workshop dates?"],
  },
  {
    patterns: ["date", "when", "august", "schedule", "3 day", "three day", "days"],
    answer: "The workshop runs for **3 days** 📅\n\n**27–29 August 2026** (Thursday to Saturday)\nUniversity of Ghana, Legon — Hybrid Format\n\nKey dates:\n• Abstract Deadline: 31 Jul 2026\n• Acceptance Notice: 8 Aug 2026\n• Workshop Begins: 27 Aug 2026",
    quick: ["Where is it held?", "What are the tracks?", "How do I register?"],
  },
  {
    patterns: ["deadline", "submit", "abstract", "submission", "paper", "31 jul", "july"],
    answer: "**Abstract Submission Deadline: 31 July 2026** 📄\n\nYou need to submit an abstract of your thesis/research during registration.\n\nAcceptance notifications will be sent by **8 August 2026**.",
    quick: ["Workshop dates?", "Presentation tracks?", "How do I register?"],
  },
  {
    patterns: ["accept", "notification", "result", "8 aug", "accepted"],
    answer: "**Acceptance notifications** will be sent by **8 August 2026** 📬\n\nThe Programme Committee reviews all submitted abstracts and contacts you via the email address you registered with.",
    quick: ["Submission deadline?", "What are the tracks?", "Workshop dates?"],
  },
  {
    patterns: ["location", "venue", "where", "legon", "campus", "hall", "room"],
    answer: "The workshop is held at the **University of Ghana, Legon** 📍\n\nDepartment of Computer Science\nSchool of Physical & Mathematical Sciences (SPMS)\nP.O. Box LG 25, Accra, Ghana\n\nIt's a **Hybrid Event** — both physical and virtual attendance are available.",
    quick: ["Workshop dates?", "How do I register?", "Virtual attendance?"],
  },
  {
    patterns: ["virtual", "online", "zoom", "hybrid", "remote", "stream", "live"],
    answer: "The workshop is a **Hybrid Event** 💻\n\nYou can attend **physically** on campus or **virtually** online. Virtual attendees will have access to the live stream during the workshop days.\n\nIndicate your preference (Physical / Virtual / Hybrid) during registration.",
    quick: ["Where is it held?", "Workshop dates?", "How do I register?"],
  },
  {
    patterns: ["track", "present", "presentation", "type", "category", "regular", "short", "poster", "technical"],
    answer: "There are **4 presentation tracks** 🎤\n\n1. **Regular Paper** — Full research papers (completed/ongoing thesis)\n2. **Short Paper** — Work-in-progress with Q&A\n3. **Poster Presentation** — Visual displays of thesis topics\n4. **Technical Paper** — Applied implementations\n\nSelect your preferred track during registration.",
    quick: ["How do I register?", "Submission deadline?", "Awards info?"],
  },
  {
    patterns: ["who", "eligible", "can i", "msc", "mphil", "phd", "programme", "program", "student"],
    answer: "The workshop is open to **all UG postgraduate students** 🎓\n\nProgrammes:\n• MSc Computer Science — **Presenter**\n• MPhil Computer Science — **Presenter**\n• MSc Data Science — **Presenter**\n• MPhil Data Science — **Presenter**\n• MSc IT for Business — Observer/Presenter\n• PhD Computer Science — Presenter\n• Other PG Students (UG) — Open\n\nAll may attend; MSc/MPhil CS & DS students are expected to present.",
    quick: ["How do I register?", "Registration fee?", "Presentation tracks?"],
  },
  {
    patterns: ["award", "prize", "winner", "best", "1st", "2nd", "3rd", "first", "second", "third"],
    answer: "Three awards are given at the **Awards Ceremony** on Day 3 🏆\n\n🥇 **First Place** — Best overall presentation\n🥈 **Second Place** — Runner-up recognition\n🥉 **Third Place** — Honourable mention\n\nA panel of academic judges evaluates all presentations across all tracks.",
    quick: ["What are the tracks?", "Workshop dates?", "How do I register?"],
  },
  {
    patterns: ["journal", "publication", "publish", "cbas", "paper published"],
    answer: "Top papers from the workshop are considered for publication in the **CBAS Journal** 📖\n\nThe **College of Basic and Applied Sciences (CBAS) Journal** is the official publication partner. The editorial committee reviews eligible submissions and contacts authors after the workshop.\n\nThis is a great opportunity to get your research published!",
    quick: ["What are the tracks?", "Submission deadline?", "Awards info?"],
  },
  {
    patterns: ["contact", "email", "phone", "reach", "committee", "organis", "organiz"],
    answer: "You can reach the **Workshop Planning Committee** at:\n\n✉️ **Email:** dcsworkshop@ug.edu.gh\n🌐 **Website:** www.cs.ug.edu.gh\n📍 Dept. of Computer Science, UG\n⏰ Mon–Fri · 8:00 AM – 5:00 PM GMT\n\nOr use the **Contact page** to send a message directly.",
    quick: ["WhatsApp support?", "How do I register?", "Workshop dates?"],
  },
  {
    patterns: ["whatsapp", "chat", "message", "text", "call"],
    answer: "You can **chat on WhatsApp** with the committee! 💬\n\nClick the green **WhatsApp button** at the bottom-right corner of any page to start a direct conversation with the Workshop Planning Committee.",
    quick: ["Contact email?", "How do I register?", "Workshop dates?"],
  },
  {
    patterns: ["sponsor", "fund", "partner", "support", "sponsorship"],
    answer: "The workshop is supported by:\n\n🏛️ **University of Ghana** — Host Institution\n🔬 **SPMS** — Faculty Sponsor\n💻 **Dept. of Computer Science** — Organising Dept.\n📖 **CBAS Journal** — Publication Partner\n\nWe are also seeking **industry partners** for 2026. Contact us at dcsworkshop@ug.edu.gh for sponsorship packages.",
    quick: ["Contact details?", "About the workshop?", "Workshop dates?"],
  },
  {
    patterns: ["keynote", "speaker", "invited", "guest"],
    answer: "**Keynote & invited speaker announcements** are coming soon! 🎤\n\nConfirmed speakers will be announced progressively on the website. Watch the **Featured Sessions** section on the home page for updates.\n\nThe keynote will take place on the morning of **Day 1 — 27 August 2026**.",
    quick: ["Workshop dates?", "What are the tracks?", "How do I register?"],
  },
  {
    patterns: ["material", "certificate", "include", "get", "receive", "snack", "refreshment"],
    answer: "Your **GHS 100 registration fee** includes:\n\n✅ Refreshments & snacks (all 3 days)\n✅ Drinking water\n✅ Workshop materials & programme booklet\n✅ Certificate of participation\n✅ Access to all sessions & networking events",
    quick: ["How do I register?", "Workshop dates?", "Virtual attendance?"],
  },
];

const QUICK_START = ["How do I register?", "Workshop dates?", "Registration fee?", "Submission deadline?"];

function matchFAQ(text) {
  const lower = text.toLowerCase();
  for (const item of FAQ) {
    if (item.patterns.some(p => lower.includes(p))) return item;
  }
  return null;
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n•/g, "<br/>•")
    .replace(/\n(\d)\./g, "<br/>$1.")
    .replace(/\n/g, "<br/>");
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I'm the **DCS Workshop Assistant**.\n\nI can answer questions about registration, dates, fees, submission, and more. How can I help you?",
      quick: QUICK_START,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [open, messages]);

  const sendMessage = (text) => {
    const msg = text.trim();
    if (!msg) return;
    setInput("");
    setMessages(m => [...m, { from: "user", text: msg }]);
    setTyping(true);

    setTimeout(() => {
      const match = matchFAQ(msg);
      const reply = match
        ? { from: "bot", text: match.answer, quick: match.quick }
        : {
            from: "bot",
            text: "I'm not sure about that one 🤔\n\nTry asking about:\n• **Registration** or **fees**\n• **Workshop dates** or **deadlines**\n• **Presentation tracks**\n• **Awards** or **publications**\n\nOr contact us directly at **dcsworkshop@ug.edu.gh**",
            quick: ["How do I register?", "Workshop dates?", "Contact details?"],
          };
      setTyping(false);
      setMessages(m => [...m, reply]);
      if (!open) setUnread(u => u + 1);
    }, 700 + Math.random() * 400);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 1000,
          width: 340, maxHeight: "72vh",
          background: "#fff", borderRadius: 20,
          boxShadow: "0 12px 48px rgba(15,35,71,0.22)",
          display: "flex", flexDirection: "column",
          border: "1px solid #e0e8f4",
          overflow: "hidden",
          animation: "chatSlideUp 0.22s ease",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #0F2347, #1B3A6B)",
            padding: "16px 18px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(201,168,76,0.25)", border: "2px solid #C9A84C",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>DCS Workshop Assistant</div>
              <div style={{ color: "#C9A84C", fontSize: 11, marginTop: 1 }}>● Online — asks answered instantly</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.6)", fontSize: 20, lineHeight: 1, padding: 2,
            }}>×</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px 14px",
            display: "flex", flexDirection: "column", gap: 12,
            background: "#f7f9fc",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "85%",
                  background: m.from === "user" ? "#1B3A6B" : "#fff",
                  color: m.from === "user" ? "#fff" : "#1a1a1a",
                  borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px", fontSize: 13, lineHeight: 1.65,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  border: m.from === "bot" ? "1px solid #e8eef6" : "none",
                }} dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }} />
                {m.quick && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8, maxWidth: "90%" }}>
                    {m.quick.map((q, qi) => (
                      <button key={qi} onClick={() => sendMessage(q)} style={{
                        background: "#E5EAF3", color: "#1B3A6B",
                        border: "1px solid #c8d4e8", borderRadius: 20,
                        padding: "5px 12px", fontSize: 11, fontWeight: 600,
                        cursor: "pointer", transition: "background 0.15s",
                        whiteSpace: "nowrap",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "#d0daea"}
                        onMouseLeave={e => e.currentTarget.style.background = "#E5EAF3"}
                      >{q}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{
                  background: "#fff", border: "1px solid #e8eef6",
                  borderRadius: "18px 18px 18px 4px", padding: "12px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}>
                  <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(d => (
                      <span key={d} style={{
                        width: 6, height: 6, borderRadius: "50%", background: "#1B3A6B",
                        display: "inline-block", opacity: 0.4,
                        animation: `dotBounce 1.2s ease-in-out ${d * 0.2}s infinite`,
                      }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px", background: "#fff",
            borderTop: "1px solid #eee",
            display: "flex", gap: 8,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask about the workshop…"
              style={{
                flex: 1, border: "1px solid #d0daea", borderRadius: 12,
                padding: "9px 14px", fontSize: 13, outline: "none",
                background: "#f7f9fc", color: "#1a1a1a",
              }}
            />
            <button onClick={() => sendMessage(input)} style={{
              background: "#1B3A6B", color: "#fff", border: "none",
              borderRadius: 12, width: 38, height: 38, cursor: "pointer",
              fontSize: 16, flexShrink: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#0F2347"}
              onMouseLeave={e => e.currentTarget.style.background = "#1B3A6B"}
            >➤</button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Workshop Assistant"
        style={{
          position: "fixed", bottom: 28, right: 96, zIndex: 1000,
          width: 56, height: 56, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg, #1B3A6B, #0F2347)",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, boxShadow: "0 4px 20px rgba(15,35,71,0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? "×" : "🤖"}
        {!open && unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#C9A84C", color: "#0F2347",
            borderRadius: "50%", width: 20, height: 20,
            fontSize: 11, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{unread}</span>
        )}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
