"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
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
}

const GITHUB_USERNAME = "Xenonesis";

const suggestedQuestions = [
  "Tell me about yourself",
  "What are your top projects?",
  "What skills do you have?",
  "How can I contact you?",
  "What's your experience?",
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch GitHub data on mount
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user profile
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const userData = await userRes.json();
        setUser(userData);

        // Fetch repositories
        const reposRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`
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
  }, [messages]);

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
        content: `Hey there! 👋 I'm Aditya's AI assistant powered by Groq. I can tell you about his projects, skills, experience, and more. What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const sendMessageToAI = async (userMessage: string): Promise<string> => {
    try {
      // Prepare chat history for context
      const chatHistory = messages.slice(-8).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      chatHistory.push({ role: "user" as const, content: userMessage });

      // Prepare GitHub data for context
      const githubData = {
        repos: user?.public_repos,
        followers: user?.followers,
        following: user?.following,
        topRepos: repos.slice(0, 5).map((repo) => ({
          name: repo.name,
          description: repo.description || "",
          language: repo.language || "",
        })),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistory,
          githubData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error calling AI:", error);
      return "I apologize, but I'm having trouble connecting right now. Please try again in a moment! 🙏";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
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
        content: "Sorry, I encountered an error. Please try again! 🙏",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
      const fakeEvent = { key: "Enter", shiftKey: false, preventDefault: () => {} } as React.KeyboardEvent;
      handleKeyDown(fakeEvent);
    }, 100);
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
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
              {/* Chat bubble with sparkle */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
              {/* Sparkle */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0-1V2m4.95 2.05l-.707.707M5.05 5.05l.707.707M19 12h1m-1 0h-1"
              />
            </motion.svg>
          )}
        </AnimatePresence>
        
        {/* Pulse animation when closed */}
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
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-140px)] rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 flex flex-col"
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
                <h3 className="font-semibold text-sm">Aditya&apos;s AI Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Powered by Groq AI
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-900/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-br-md"
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-sm border border-zinc-100 dark:border-zinc-700/50 rounded-bl-md"
                    }`}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-zinc-100 dark:border-zinc-700/50">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      <span className="text-xs text-zinc-400 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (only show when few messages) */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isTyping}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 transition-colors disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 disabled:opacity-50"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
