"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LogIn, Send, Loader2, Zap, Wifi, WifiOff, Trash2, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Scholarship } from "../types/scholarship";
import { mockScholarships, indianStates } from "../data/scholarships";
import ScholarshipCard from "./ScholarshipCard";
import { useChatLimit } from "../hooks/useChatLimit";
import { sendChatMessage, checkBackendHealth } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useChat, ChatMessage } from "../context/ChatContext";


export type { ChatMessage };

interface ChatEngineProps {
  onOpenDetails: (scholarship: Scholarship) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export default function ChatEngine({ onOpenDetails, savedIds, onToggleSave }: ChatEngineProps) {
  const { isLimitReached, incrementMessageCount } = useChatLimit();
  const { userProfile } = useAuth();
  const { threads, activeThreadId, updateThreadMessages } = useChat();
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  // ── Local message state (React batches these correctly) ──
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const loadedThreadRef = useRef<string | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((online) => {
      setIsBackendOnline(online);
    });
  }, []);

  // Load messages from context when thread changes
  useEffect(() => {
    if (activeThreadId !== loadedThreadRef.current) {
      const thread = threads.find((t) => t.id === activeThreadId);
      const initialText = isBackendOnline
        ? "// AVORIQ TERMINAL v1.0\n// AI Scholarship Engine Connected.\n// Powered by AvorIQ AI — ask me anything about scholarships."
        : "// AVORIQ TERMINAL v1.0\n// Scholarship Intelligence Module Active.\n// Type a query to begin matching.";

      if (thread && thread.messages.length > 0) {
        setMessages(thread.messages.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)));
      } else {
        setMessages([{ id: "1", sender: "ai", text: initialText }]);
      }
      loadedThreadRef.current = activeThreadId;
      setIsTyping(false);
    }
  }, [activeThreadId, threads, isBackendOnline]);

  // Read and inject pending query from other pages
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingQuery = window.localStorage.getItem("avoriq_pending_chat_query");
      if (pendingQuery) {
        window.localStorage.removeItem("avoriq_pending_chat_query");
        setInputValue(pendingQuery);
      }
    }
  }, [activeThreadId]);

  // Sync local messages back to context when streaming finishes
  useEffect(() => {
    const isCurrentlyStreaming = messages.some((m) => m.isStreaming);
    if (!isCurrentlyStreaming && messages.length > 0 && loadedThreadRef.current === activeThreadId) {
      updateThreadMessages(activeThreadId, messages);
    }
  }, [messages, activeThreadId, updateThreadMessages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Mock fallback logic (original parseAndMatch) ──
  const parseAndMatch = useCallback((query: string): Scholarship[] => {
    const q = query.toLowerCase();
    
    const greetings = ["hi", "hello", "hey", "hola", "greetings", "good morning", "good afternoon", "good evening"];
    const isGreetingOnly = greetings.some(g => q.trim() === g || q.trim().startsWith(g + " "));
    if (isGreetingOnly) return [];

    let matched = mockScholarships;
    let filterApplied = false;

    if (q.includes("girl") || q.includes("female") || q.includes("women") || q.includes("girls")) {
      matched = matched.filter((s) => s.eligibility.gender === "Female" || s.eligibility.gender === "All");
      filterApplied = true;
    } else if (q.includes("boy") || q.includes("male") || q.includes("boys")) {
      matched = matched.filter((s) => s.eligibility.gender === "All");
      filterApplied = true;
    }

    if (q.includes("engineer") || q.includes("btech") || q.includes("engineering") || q.includes("tech") || q.includes("computer")) {
      matched = matched.filter((s) => s.eligibility.fieldsOfStudy.includes("Engineering") || s.eligibility.fieldsOfStudy.includes("All"));
      filterApplied = true;
    } else if (q.includes("medical") || q.includes("mbbs") || q.includes("doctor")) {
      matched = matched.filter((s) => s.eligibility.fieldsOfStudy.includes("Medical") || s.eligibility.fieldsOfStudy.includes("All"));
      filterApplied = true;
    } else if (q.includes("science") || q.includes("bsc")) {
      matched = matched.filter((s) => s.eligibility.fieldsOfStudy.includes("Science") || s.eligibility.fieldsOfStudy.includes("All"));
      filterApplied = true;
    } else if (q.includes("commerce") || q.includes("bcom")) {
      matched = matched.filter((s) => s.eligibility.fieldsOfStudy.includes("Commerce") || s.eligibility.fieldsOfStudy.includes("All"));
      filterApplied = true;
    }

    if (q.includes("postgrad") || q.includes("pg") || q.includes("master")) {
      matched = matched.filter((s) => s.eligibility.educationLevel.includes("PG"));
      filterApplied = true;
    } else if (q.includes("undergrad") || q.includes("ug") || q.includes("bachelor")) {
      matched = matched.filter((s) => s.eligibility.educationLevel.includes("UG"));
      filterApplied = true;
    } else if (q.includes("diploma")) {
      matched = matched.filter((s) => s.eligibility.educationLevel.includes("Diploma"));
      filterApplied = true;
    }

    if (q.includes("govt") || q.includes("government")) {
      matched = matched.filter((s) => s.category === "Government");
      filterApplied = true;
    } else if (q.includes("private")) {
      matched = matched.filter((s) => s.category === "Private");
      filterApplied = true;
    } else if (q.includes("ngo") || q.includes("trust")) {
      matched = matched.filter((s) => s.category === "NGO" || s.category === "Private");
      filterApplied = true;
    }

    if (q.includes("sc ") || q.includes(" sc") || q === "sc") {
      matched = matched.filter((s) => s.eligibility.castes.includes("SC"));
      filterApplied = true;
    } else if (q.includes("st ") || q.includes(" st") || q === "st") {
      matched = matched.filter((s) => s.eligibility.castes.includes("ST"));
      filterApplied = true;
    } else if (q.includes("obc")) {
      matched = matched.filter((s) => s.eligibility.castes.includes("OBC"));
      filterApplied = true;
    }

    const matchedState = indianStates.find(state => q.includes(state.toLowerCase()));
    if (matchedState) {
      matched = matched.filter(s => s.eligibility.states.includes("All") || s.eligibility.states.includes(matchedState));
      filterApplied = true;
    }

    if (filterApplied) return matched;

    const isSeekingGeneral = q.includes("scholarship") || q.includes("find") || q.includes("show") || q.includes("list");
    if (isSeekingGeneral) return mockScholarships;

    return [];
  }, []);

  const fallbackToMock = useCallback((userQuery: string) => {
    setTimeout(() => {
      setIsTyping(false);
      const results = parseAndMatch(userQuery);
      
      const greetings = ["hi", "hello", "hey", "hola", "greetings", "good morning", "good afternoon", "good evening"];
      const isGreeting = greetings.some(g => userQuery.toLowerCase().trim() === g || userQuery.toLowerCase().trim().startsWith(g + " "));

      let aiText = "";
      if (isGreeting) {
        aiText = "// AVORIQ TERMINAL v1.0\n// Hello! I am your AI Scholarship Companion.\n// How can I assist you today? You can ask me things like:\n// - 'Show me scholarships for engineering students'\n// - 'Are there any scholarships for girls?'\n// - 'List postgraduate scholarships'";
      } else if (results.length > 0) {
        aiText = `// MATCH FOUND.\n// Found ${results.length} matching scholarships. Displaying top matches below:`;
      } else {
        aiText = "// ANALYSIS COMPLETE.\n// No matching scholarships found for your query.\n// Try searching using other keywords (e.g. 'girls', 'engineering', 'government', 'UG', 'caste SC').";
      }

      setMessages((prev) => {
        const shownIds = new Set<string>();
        prev.forEach((m) => {
          if (m.results) {
            m.results!.forEach((s) => shownIds.add(s.id));
          }
        });
        const filteredResults = results.filter((s) => !shownIds.has(s.id));
        const finalResults = filteredResults.length > 0 && !isGreeting ? filteredResults.slice(0, 3) : undefined;

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiText,
          results: finalResults,
        };
        return [...prev, aiResponse];
      });
    }, 1200);
  }, [parseAndMatch, setMessages]);

  // ── Handle sending (AI backend or fallback) ──
  const handleSend = useCallback(async () => {
    if ((!inputValue.trim() && !selectedFile) || isTyping) return;
    if (isLimitReached) return;

    let userQuery = inputValue;
    if (selectedFile) {
      userQuery += `\n[Attached File: ${selectedFile.name}]`;
    }
    const newMessage: ChatMessage = { id: Date.now().toString(), sender: "user", text: userQuery };

    // Read file if present
    let fileBase64: string | null = null;
    let fileName: string | null = null;
    let fileType: string | null = null;

    if (selectedFile) {
      fileName = selectedFile.name;
      fileType = selectedFile.type;
      try {
        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      } catch (err) {
        console.error("Failed to read file:", err);
      }
    }

    // Find the most recent AI message that has results (scholarships) shown
    let activeScholarships: Scholarship[] | null = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === "ai" && messages[i].results && messages[i].results!.length > 0) {
        activeScholarships = messages[i].results || null;
        break;
      }
    }

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setSelectedFile(null); // Clear selected file after sending
    setIsTyping(true);
    incrementMessageCount();

    // ── Try AI backend first ──
    if (isBackendOnline) {
      const aiMsgId = (Date.now() + 1).toString();
      let streamedText = "";

      // Add an empty AI message that we'll stream into
      setMessages((prev) => [...prev, {
        id: aiMsgId,
        sender: "ai",
        text: "",
        isStreaming: true,
      }]);

      try {
        let apiMessage = userQuery;
        if (typeof window !== "undefined") {
          const csvData = window.localStorage.getItem("avoriq_calibration_csv");
          if (csvData) {
            apiMessage = `[STUDENT CALIBRATION PARAMETERS (CSV FORMAT):\n${csvData}\n]\n\nUser query: ${userQuery}`;
          }
        }

        await sendChatMessage(
          apiMessage,
          userProfile ? {
            educationLevel: userProfile.educationLevel,
            gender: userProfile.gender,
            familyIncomeMax: userProfile.familyIncomeMax,
            state: userProfile.state,
            caste: userProfile.caste,
          } : null,
          {
            onScholarships: (scholarships) => {
              // Only show scholarship cards if backend sent non-empty array
              // Filter out scholarships that have already been shown in previous messages of this conversation.
              setMessages((prev) => {
                const shownIds = new Set<string>();
                prev.forEach((m) => {
                  if (m.id !== aiMsgId && m.results) {
                    m.results!.forEach((s) => shownIds.add(s.id));
                  }
                });

                const filtered = scholarships
                  ? scholarships.filter((s) => !shownIds.has(s.id))
                  : [];

                return prev.map((m) =>
                  m.id === aiMsgId
                    ? { ...m, results: filtered.length > 0 ? filtered : undefined }
                    : m
                );
              });
            },
            onToken: (token) => {
              streamedText += token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId ? { ...m, text: streamedText } : m
                )
              );
            },
            onDone: () => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId ? { ...m, isStreaming: false } : m
                )
              );
              setIsTyping(false);
            },
            onError: (error) => {
              // If streaming fails, fall back to mock
              console.error("Chat API error:", error);
              setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
              setIsBackendOnline(false);
              fallbackToMock(userQuery);
            },
          },
          activeScholarships,
          messages,
          fileBase64,
          fileName,
          fileType
        );
      } catch {
        // Network error — fall back to mock
        setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
        setIsBackendOnline(false);
        fallbackToMock(userQuery);
      }
    } else {
      // ── Fallback to mock matching ──
      fallbackToMock(userQuery);
    }
  }, [inputValue, selectedFile, isTyping, isLimitReached, isBackendOnline, userProfile, incrementMessageCount, fallbackToMock, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Top Bar with Status and Actions */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        {/* Reset Chat Button */}
        {messages.length > 1 && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear the chat history?")) {
                const initialMsg: ChatMessage = {
                  id: "1",
                  sender: "ai",
                  text: isBackendOnline
                    ? "// AVORIQ TERMINAL v1.0\n// AI Scholarship Engine Connected.\n// Powered by AvorIQ AI — ask me anything about scholarships."
                    : "// AVORIQ TERMINAL v1.0\n// Scholarship Intelligence Module Active.\n// Type a query to begin matching.",
                };
                setMessages([initialMsg]);
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border border-bauhaus-red/30 text-bauhaus-red hover:bg-bauhaus-red hover:text-white transition-all cursor-pointer bg-background"
            title="Reset Terminal Chat"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}

        <div className={`flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border ${
          isBackendOnline === null
            ? "border-[#333] text-slate-500 bg-background"
            : isBackendOnline
            ? "border-green-800 text-green-500 bg-green-500/5"
            : "border-[#333] text-slate-500 bg-surface-2"
        }`}>
          {isBackendOnline === null ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isBackendOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          {isBackendOnline === null ? "Connecting..." : isBackendOnline ? "AI Online" : "Offline Mode"}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-8 pb-32 scrollbar-hide">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className={`w-8 h-8 flex items-center justify-center shrink-0 mt-1 font-black text-xs ${
                    isBackendOnline ? "bg-bauhaus-red text-white" : "bg-surface-2 border-2 border-[#333] text-slate-400"
                  }`}>
                    AI
                  </div>
                )}

                <div className={`flex flex-col gap-4 max-w-[85%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-surface-2 border-2 border-[#333] text-slate-300"
                        : isBackendOnline && msg.id !== "1"
                        ? "bg-transparent text-slate-300 font-sans text-sm leading-relaxed"
                        : "bg-transparent text-slate-400 font-mono text-xs"
                    }`}
                  >
                    {msg.text}
                    {msg.isStreaming && (
                      <span className="inline-block ml-1 animate-pulse text-bauhaus-red">█</span>
                    )}
                  </div>

                  {msg.results && msg.results!.length > 0 && (
                    <div className="grid grid-cols-1 gap-0 w-full">
                      {msg.results!.slice(0, 3).map((scholarship) => {
                        // Use real similarity score from backend, fallback to 80
                        const rawScore = (scholarship as any)._similarityScore;
                        const matchScore = rawScore
                          ? Math.round(rawScore * 100)
                          : 80;
                        return (
                          <ScholarshipCard
                            key={scholarship.id}
                            scholarship={scholarship}
                            isSaved={savedIds.includes(scholarship.id)}
                            onToggleSave={(e) => {
                              e.stopPropagation();
                              onToggleSave(scholarship.id);
                            }}
                            onOpenDetails={() => onOpenDetails(scholarship)}
                            matchScore={matchScore}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center shrink-0 mt-1 font-black text-xs">
                    U
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-4">
              <div className={`w-8 h-8 flex items-center justify-center shrink-0 font-black text-xs ${
                isBackendOnline ? "bg-bauhaus-red text-white" : "bg-surface-2 border-2 border-[#333] text-slate-400"
              }`}>
                AI
              </div>
              <div className="flex items-center gap-1.5 px-2 font-mono text-xs text-bauhaus-red">
                <span className="animate-pulse">█</span>
                <span className="text-slate-500">
                  {isBackendOnline ? "thinking..." : "processing..."}
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-3xl mx-auto relative">
          
          {/* File Preview Badge */}
          {selectedFile && (
            <div className="absolute top-[-38px] left-0 right-0 px-4 py-2 bg-surface border-t-2 border-x-2 border-[#333] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="truncate">📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-bauhaus-red hover:text-foreground font-black ml-2 uppercase cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}

          <div className="relative flex items-center bg-surface border-2 border-[#333] focus-within:border-bauhaus-red focus-within:shadow-[3px_3px_0px_0px_#D92A2A] transition-all">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isBackendOnline ? "// ASK ME ABOUT SCHOLARSHIPS..." : "// TYPE YOUR QUERY..."}
              className="w-full max-h-40 min-h-[56px] py-4 pl-5 pr-24 bg-transparent text-foreground text-sm font-mono focus:outline-none resize-none scrollbar-hide placeholder:text-slate-600 placeholder:uppercase"
              rows={1}
            />

            {/* Paperclip Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-12 p-2.5 text-slate-500 hover:text-foreground transition-all cursor-pointer"
              title="Upload File"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={(!inputValue.trim() && !selectedFile) || isTyping || isLimitReached}
              className={`absolute right-2 p-2.5 transition-all ${
                (inputValue.trim() || selectedFile) && !isTyping && !isLimitReached
                  ? "bg-bauhaus-red text-white cursor-pointer"
                  : "bg-surface-2 text-slate-600"
              }`}
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-3 font-black uppercase tracking-widest">
            {isBackendOnline
              ? "Powered by AvorIQ AI. AvorIQ can make mistakes."
              : "AvorIQ can make mistakes. Verify important information."}
          </p>
        </div>
      </div>

      {/* Limit Overlay */}
      <AnimatePresence>
        {isLimitReached && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/90"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-surface border-2 border-foreground brutal-shadow-lg p-8 text-center relative"
            >
              <div className="w-16 h-16 bg-bauhaus-red text-white flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wider text-foreground mb-3">Limit Reached</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed uppercase tracking-wider">
                Sign in to unlock unlimited messages and premium features.
              </p>
              <div className="space-y-3">
                <Link href="/login" className="block">
                  <button className="w-full py-4 bg-bauhaus-red text-white font-black uppercase tracking-widest text-sm border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </button>
                </Link>
                <Link href="/" className="block">
                  <button className="w-full py-4 bg-transparent text-slate-400 font-black uppercase tracking-widest text-sm border-2 border-[#333] hover:border-foreground hover:text-foreground transition-all cursor-pointer">
                    Back to Home
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
