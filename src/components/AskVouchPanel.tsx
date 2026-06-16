import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, RefreshCw, HelpCircle, CornerDownRight, ArrowRight, User } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'vouch';
  text: string;
}

const PRELOADED_QUESTIONS = [
  "Can I trust Dyson?",
  "Why is Mamaearth lower than Minimalist?",
  "Which hair care brands are safest?",
  "What factors affect scam risk in Vouch?"
];

const LOADING_STEPS = [
  "Authenticating active brand registries...",
  "Running review authenticity models...",
  "Weighting transparency declarations...",
  "Evaluating community consensus...",
  "Finalizing trust intelligence response..."
];

export default function AskVouchPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'vouch',
      text: "Hello! I am **Vouch AI**, your dedicated Brand Trust Intelligent Assistant. Ask me anything about evaluated brands, scam alerts, scoring methods, or categories.\n\n*Try clicking one of the popular inquiries below or type a custom brand question!*"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS[0]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let stepIdx = 0;
      interval = setInterval(() => {
        stepIdx = (stepIdx + 1) % LOADING_STEPS.length;
        setLoadingStep(LOADING_STEPS[stepIdx]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Append User Message
    const updatedMessages = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(updatedMessages);
    setInputVal('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: 'vouch', text: `Failed to fetch: ${data.error}` }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'vouch', text: data.text || "No response received. Please try again." }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'vouch', text: `Network feedback connection issue: ${err.message || "Please check server status."}` }
      ]);
    } finally {
      loadingStep && setLoading(false);
    }
  };

  // Helper to format basic markdown elements
  const formatMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // Direct headers
      if (line.startsWith('### ')) {
        return <h4 key={`h-${lIdx}`} className="text-sm font-bold text-gray-900 mt-3 mb-1.5 font-display flex items-center gap-1.5"><CornerDownRight className="w-3 h-3 text-black font-semibold" /> {line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={`h-${lIdx}`} className="text-base font-bold text-gray-900 mt-4 mb-2 font-display">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={`h-${lIdx}`} className="text-lg font-bold text-gray-950 mt-4 mb-2 border-b border-gray-200 pb-1 font-display">{line.replace('# ', '')}</h2>;
      }

      // Check lists
      let content = line;
      let isList = false;
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        isList = true;
        content = line.trim().substring(2);
      }

      // Render bold segments safely
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`b-${match.index}`} className="text-emerald-800 font-bold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const finalContent = parts.length > 0 ? parts : content;

      if (isList) {
        return (
          <div key={`li-${lIdx}`} className="flex items-start gap-2 pl-4 py-1">
            <span className="text-black font-semibold shrink-0 select-none">•</span>
            <span className="text-gray-700 text-sm leading-relaxed">{finalContent}</span>
          </div>
        );
      } else {
        return (
          <p key={`p-${lIdx}`} className={`text-sm text-gray-700 leading-relaxed mb-1.5 ${line.trim() === '' ? 'h-2' : ''}`}>
            {finalContent}
          </p>
        );
      }
    });
  };

  return (
    <div id="ai-chat-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
      {/* Sidebar tips */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-black w-5 h-5 shrink-0" />
            <h3 className="font-display font-bold text-gray-950 text-sm">Vouch Trust Engine AI</h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            The Vouch assistant aggregates parameters across all <strong>8 core trust pillars</strong> including review validation, company registered data, and user referrals.
          </p>
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Example Queries</h4>
            <div className="space-y-1.5">
              {PRELOADED_QUESTIONS.map((q, idx) => (
                <button
                  key={`pre-q-${idx}`}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl p-2.5 text-xs text-gray-700 flex items-center justify-between group transition-all cursor-pointer shadow-3xs"
                >
                  <span className="truncate">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest font-mono">Why Ask Vouch?</h4>
          <p className="text-xs text-emerald-950/80 mt-2 leading-relaxed font-sans">
            Standard chat agents summarize random web reviews, which are easily falsifiable. Vouch grounds query answers directly on verified, continuous brand assessment datasets to prevent review slop.
          </p>
        </div>
      </div>

      {/* Main chat viewport */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm min-h-[500px]">
        {/* Chat header */}
        <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <div>
              <span className="text-xs font-mono text-gray-400 block tracking-tight">Active Trust Consultant</span>
              <span className="text-sm font-bold font-display text-gray-900">Vouch Intelligence Assistant</span>
            </div>
          </div>
          <button
            onClick={() => {
              setMessages([
                {
                  sender: 'vouch',
                  text: "System cache cleared! Ask me anything about evaluated brands, scam alerts, or scoring models."
                }
              ]);
            }}
            className="text-xs text-gray-605 hover:text-black flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-gray-200 hover:bg-gray-55 transition-colors shadow-3xs cursor-pointer font-semibold"
          >
            <RefreshCw className="w-3 h-3" /> Reset Conversation
          </button>
        </div>

        {/* Scrollable thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px]">
          {messages.map((m, idx) => (
            <div
              key={`msg-${idx}`}
              className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Profile icon */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-mono text-xs font-bold border ${
                m.sender === 'user'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-gray-550'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : 'V'}
              </div>

              {/* Message frame */}
              <div className={`rounded-xl p-4 text-justify ${
                m.sender === 'user'
                  ? 'bg-emerald-55/20 border border-emerald-100/60 rounded-tr-none text-gray-900 font-sans'
                  : 'bg-gray-50 border border-gray-200 rounded-tl-none font-sans'
              }`}>
                {formatMessageText(m.text)}
              </div>
            </div>
          ))}

          {/* Loading status bubble */}
          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-gray-500 shrink-0 flex items-center justify-center font-mono text-xs">
                V
              </div>
              <div className="bg-slate-50 border border-gray-200 rounded-xl rounded-tl-none p-4 flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-black animate-spin" />
                <span className="text-xs text-gray-500 font-mono tracking-tight font-bold">{loadingStep}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="p-4 bg-slate-50 border-t border-gray-200 flex gap-2.5"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
            placeholder={loading ? "Generating analysis..." : "Type a query (e.g. 'Should I choose Minimalist or Mamaearth?')..."}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black text-gray-950 placeholder-gray-400 focus:ring-1 focus:ring-black/10 shadow-3xs"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || loading}
            className="bg-black text-white font-semibold rounded-xl px-5 flex items-center gap-1.5 transition-all outline-none font-display text-sm hover:bg-gray-850 active:scale-95 disabled:scale-100 disabled:opacity-40 disabled:hover:bg-black pointer-events-auto cursor-pointer"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
