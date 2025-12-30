"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  topics: string[];
}

interface GitHubUser {
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
  location: string;
  company: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  reaction?: "like" | "dislike" | null;
}

const GITHUB_USERNAME = "Xenonesis";

const suggestedQuestions = [
  "Tell me about yourself",
  "What projects have you built?",
  "What are your technical skills?",
  "How can I contact you?",
  "Describe your work experience",
  "What certifications do you have?",
  "What technologies do you specialize in?",
];

// Quick Links for portfolio sections
const quickLinks = [
  { label: "Resume", icon: "📄", action: "resume" },
  { label: "GitHub", icon: "◆", action: "github" },
  { label: "LinkedIn", icon: "◇", action: "linkedin" },
  { label: "Email", icon: "✉", action: "email" },
];

// Skeleton Loader Component
function MessageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] w-64 bg-white dark:bg-card rounded-2xl rounded-bl-md shadow-sm border border-zinc-100 dark:border-zinc-700/50 p-4 space-y-3">
        <div className="h-3 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded-full animate-shimmer bg-[length:200%_100%]" />
        <div className="h-3 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded-full animate-shimmer bg-[length:200%_100%] w-[90%]" style={{ animationDelay: "0.1s" }} />
        <div className="h-3 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded-full animate-shimmer bg-[length:200%_100%] w-[75%]" style={{ animationDelay: "0.2s" }} />
        <div className="h-3 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded-full animate-shimmer bg-[length:200%_100%] w-[85%]" style={{ animationDelay: "0.3s" }} />
      </div>
    </motion.div>
  );
}

// Copy Button Component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
      title="Copy message"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// Reaction Buttons Component
function ReactionButtons({ 
  messageId, 
  currentReaction, 
  onReact 
}: { 
  messageId: string; 
  currentReaction?: "like" | "dislike" | null;
  onReact: (messageId: string, reaction: "like" | "dislike") => void;
}) {
  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => onReact(messageId, "like")}
        className={`p-1 rounded transition-colors ${
          currentReaction === "like" 
            ? "bg-green-100 dark:bg-green-900/30 text-green-600" 
            : "hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400"
        }`}
        title="Helpful"
      >
        <svg className="w-3.5 h-3.5" fill={currentReaction === "like" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      </button>
      <button
        onClick={() => onReact(messageId, "dislike")}
        className={`p-1 rounded transition-colors ${
          currentReaction === "dislike" 
            ? "bg-red-100 dark:bg-red-900/30 text-red-600" 
            : "hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400"
        }`}
        title="Not helpful"
      >
        <svg className="w-3.5 h-3.5" fill={currentReaction === "dislike" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
      </button>
    </div>
  );
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch GitHub data on mount
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const userData = await userRes.json();
        setUser(userData);

        const reposRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=15`
        );
        const reposData = await reposRes.json();
        setRepos(reposData);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchGitHubData();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Add welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: `Welcome. I'm Aditya's AI portfolio assistant.\n\nI can provide information about:\n• Projects and technical work\n• Skills and expertise\n• Professional experience\n• Contact details\n\nHow may I assist you?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to toggle chat
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendMessageToAI = useCallback(async (userMessage: string): Promise<string> => {
    try {
      const chatHistory = messages.slice(-8).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      chatHistory.push({ role: "user" as const, content: userMessage });

      const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];

      const githubData = {
        repos: user?.public_repos,
        followers: user?.followers,
        following: user?.following,
        languages: languages.slice(0, 8),
        topRepos: repos.slice(0, 10).map((repo) => ({
          name: repo.name,
          description: repo.description || "",
          language: repo.language || "",
          stargazers_count: repo.stargazers_count || 0,
          forks_count: repo.forks_count || 0,
        })),
      };

      const currentTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "short",
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistory,
          githubData,
          currentTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error calling AI:", error);
      return "I apologize, but I'm experiencing connection issues. Please try again shortly.";
    }
  }, [messages, repos, user]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLastQuery(input.trim());
    const userInput = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendMessageToAI(userInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "An error occurred. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegenerate = async () => {
    if (!lastQuery || isTyping) return;
    
    // Remove last assistant message
    setMessages((prev) => prev.slice(0, -1));
    setIsTyping(true);

    try {
      const response = await sendMessageToAI(lastQuery);
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (isTyping) return;
    setInput(question);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowClearConfirm(false);
    setLastQuery("");
  };

  const handleReaction = (messageId: string, reaction: "like" | "dislike") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, reaction: msg.reaction === reaction ? null : reaction }
          : msg
      )
    );
  };

  const handleQuickLink = (action: string) => {
    switch (action) {
      case "resume":
        window.open("/Aditya.pdf", "_blank");
        break;
      case "github":
        window.open(`https://github.com/${GITHUB_USERNAME}`, "_blank");
        break;
      case "linkedin":
        window.open("https://www.linkedin.com/in/itisaddy/", "_blank");
        break;
      case "email":
        window.location.href = "mailto:itisaddy7@gmail.com";
        break;
    }
    setShowQuickLinks(false);
  };

  const handleExport = (format: "text" | "json") => {
    const chatContent = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
    }));

    let content: string;
    let filename: string;
    let type: string;

    if (format === "json") {
      content = JSON.stringify(chatContent, null, 2);
      filename = `chat-export-${Date.now()}.json`;
      type = "application/json";
    } else {
      content = messages
        .map((msg) => `[${msg.role.toUpperCase()}] ${msg.content}`)
        .join("\n\n---\n\n");
      filename = `chat-export-${Date.now()}.txt`;
      type = "text/plain";
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const chatWindowClasses = isExpanded
    ? "fixed inset-4 z-50 rounded-2xl"
    : "fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-140px)] rounded-2xl";

  return (
    <>
      {/* Shimmer animation style */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Floating AI Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        title="Open chat (Ctrl+K)"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="ai"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`${chatWindowClasses} overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-700/50 bg-white dark:bg-background flex flex-col`}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {user?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Portfolio Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  {user?.public_repos || "—"} repos • Groq AI
                </p>
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center gap-0.5">
                {/* Quick Links */}
                <div className="relative">
                  <button
                    onClick={() => setShowQuickLinks(!showQuickLinks)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    title="Quick links"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {showQuickLinks && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 min-w-[120px] z-50"
                      >
                        {quickLinks.map((link) => (
                          <button
                            key={link.action}
                            onClick={() => handleQuickLink(link.action)}
                            className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                          >
                            <span>{link.icon}</span>
                            {link.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Export Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    title="Export chat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {showExportMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 min-w-[100px] z-50"
                      >
                        <button
                          onClick={() => handleExport("text")}
                          className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        >
                          Export as .txt
                        </button>
                        <button
                          onClick={() => handleExport("json")}
                          className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        >
                          Export as .json
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clear Chat */}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Expand/Collapse */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isExpanded ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    )}
                  </svg>
                </button>
                
                {/* Minimize */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Minimize (Esc)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Clear Confirmation */}
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center justify-between"
                >
                  <span className="text-xs text-amber-800 dark:text-amber-200">Clear conversation?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearChat}
                      className="px-2 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-background/50">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group`}
                >
                  <div className="flex flex-col max-w-[85%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-br-md"
                          : "bg-white dark:bg-card text-zinc-700 dark:text-zinc-200 shadow-sm border border-zinc-100 dark:border-zinc-700/50 rounded-bl-md"
                      }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {message.content}
                    </div>
                    {/* Message Footer */}
                    <div className={`flex items-center gap-2 mt-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {message.role === "assistant" && (
                        <>
                          <CopyButton text={message.content} />
                          <ReactionButtons 
                            messageId={message.id} 
                            currentReaction={message.reaction}
                            onReact={handleReaction}
                          />
                          {/* Regenerate button for last assistant message */}
                          {index === messages.length - 1 && !isTyping && (
                            <button
                              onClick={handleRegenerate}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-zinc-400"
                              title="Regenerate response"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Skeleton Loader */}
              {isTyping && <MessageSkeleton />}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-background">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wide">Quick Questions</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 4).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isTyping}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-muted text-zinc-600 dark:text-zinc-400 hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 transition-colors disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-background">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, skills, or experience..."
                  disabled={isTyping}
                  maxLength={500}
                  className="flex-1 px-4 py-2.5 text-sm bg-zinc-100 dark:bg-muted border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              
              {/* Footer info */}
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  Press Ctrl+K to toggle • Esc to close
                </span>
                {input.length > 0 && (
                  <span className={`text-[10px] ${input.length > 450 ? "text-amber-500" : "text-zinc-400"}`}>
                    {input.length}/500
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
