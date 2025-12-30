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

// Pre-defined responses based on keywords
const portfolioInfo = {
  name: "Aditya Kumar Tiwari",
  title: "Cybersecurity Specialist & Full-Stack Developer",
  email: "itisaddy7@gmail.com",
  linkedin: "https://www.linkedin.com/in/itisaddy/",
  location: "Delhi, India",
  education: "BCA in Cybersecurity from Sushant University (2022-2025)",
  skills: [
    "Python", "JavaScript", "TypeScript", "PHP", "Rust",
    "React", "Node.js", "Laravel", "AWS", "Docker",
    "Cybersecurity", "Penetration Testing", "AI/ML"
  ],
  interests: ["Cybersecurity", "Full-Stack Development", "AI/ML", "Open Source"],
};

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
        content: `Hey there! 👋 I'm Aditya's AI assistant. I can tell you about his projects, skills, experience, and more. What would you like to know?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // About/Introduction
    if (lowerQuery.includes("about") || lowerQuery.includes("yourself") || lowerQuery.includes("who") || lowerQuery.includes("introduce")) {
      return `I'm ${portfolioInfo.name}, a ${portfolioInfo.title} based in ${portfolioInfo.location}. 

I'm currently pursuing my ${portfolioInfo.education}. I love building secure, scalable applications and exploring the intersection of cybersecurity and AI.

I'm passionate about open source and have ${user?.public_repos || "multiple"} public repositories on GitHub! 🚀`;
    }

    // Projects
    if (lowerQuery.includes("project") || lowerQuery.includes("work") || lowerQuery.includes("built") || lowerQuery.includes("portfolio")) {
      const topRepos = repos.slice(0, 5);
      if (topRepos.length > 0) {
        const projectList = topRepos
          .map((repo) => `• **${repo.name}** - ${repo.description || "No description"} ${repo.language ? `(${repo.language})` : ""}`)
          .join("\n");
        return `Here are some of my recent projects:\n\n${projectList}\n\nYou can find all my projects on GitHub: github.com/${GITHUB_USERNAME} 💻`;
      }
      return "I have several exciting projects including Cinesphere (movie website), Juris.AI (legal AI platform), and PropDekho (real estate platform). Check them out on GitHub!";
    }

    // Skills
    if (lowerQuery.includes("skill") || lowerQuery.includes("tech") || lowerQuery.includes("language") || lowerQuery.includes("stack") || lowerQuery.includes("tools")) {
      const languages = repos
        .map((r) => r.language)
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i);
      
      return `My technical arsenal includes:

🔐 **Cybersecurity**: Penetration Testing, SIEM, Network Security, Vulnerability Assessment

💻 **Languages**: ${portfolioInfo.skills.slice(0, 5).join(", ")}

🛠️ **Frameworks & Tools**: React, Node.js, Laravel, Docker, AWS

📊 **Currently exploring**: AI/ML, Rust, Cloud Security

${languages.length > 0 ? `\nMost used languages on GitHub: ${languages.slice(0, 5).join(", ")}` : ""}`;
    }

    // Contact
    if (lowerQuery.includes("contact") || lowerQuery.includes("reach") || lowerQuery.includes("email") || lowerQuery.includes("hire") || lowerQuery.includes("connect")) {
      return `Great! You can reach out to Aditya through:

📧 **Email**: ${portfolioInfo.email}
💼 **LinkedIn**: linkedin.com/in/itisaddy
🐙 **GitHub**: github.com/${GITHUB_USERNAME}

Feel free to DM for collaborations, job opportunities, or just a friendly chat about cybersecurity and development! 🤝`;
    }

    // Experience
    if (lowerQuery.includes("experience") || lowerQuery.includes("job") || lowerQuery.includes("work history") || lowerQuery.includes("career")) {
      return `Here's my professional journey:

🔧 **Laravel Developer** @ Prarang (Sept-Oct 2025)
   PHP, Laravel, Cloud Computing

👨‍🏫 **Mentor (Part-time)** @ JhaMobii Technologies (Aug 2024 - Present)
   Cybersecurity mentorship, Team guidance

🛡️ **Cybersecurity Intern** @ Null (Jun 2024 - Present)
   SIEM Tools, Network Security, Incident Response

🤖 **Cybersecurity & AI/ML Intern** @ Quantam Pvt. Ltd. (Oct 2024 - Present)
   AI/ML applications in security`;
    }

    // Education
    if (lowerQuery.includes("education") || lowerQuery.includes("study") || lowerQuery.includes("degree") || lowerQuery.includes("college") || lowerQuery.includes("university")) {
      return `🎓 **Education**

I'm pursuing a **BCA in Cybersecurity** from **Sushant University**, Delhi, India (2022-2025).

My coursework focuses on network security, ethical hacking, cryptography, and secure software development. I complement my studies with hands-on projects and internships! 📚`;
    }

    // GitHub stats
    if (lowerQuery.includes("github") || lowerQuery.includes("repo") || lowerQuery.includes("contribution") || lowerQuery.includes("open source")) {
      return `My GitHub stats:

📦 **Repositories**: ${user?.public_repos || "20+"}
👥 **Followers**: ${user?.followers || "Growing!"}
⭐ **Following**: ${user?.following || "Community members"}

I'm active in open source and love contributing to interesting projects. Check out my profile: github.com/${GITHUB_USERNAME} 🌟`;
    }

    // Fun/Personal
    if (lowerQuery.includes("hobby") || lowerQuery.includes("fun") || lowerQuery.includes("free time") || lowerQuery.includes("interest")) {
      return `When I'm not coding or breaking things (ethically! 😄), I enjoy:

🎵 Listening to music while coding (check out my Spotify playlist on the portfolio!)
🎮 Gaming and exploring new technologies
📖 Reading about cybersecurity and AI trends
🌐 Contributing to open source projects

I believe in continuous learning and staying updated with the latest in tech! 🚀`;
    }

    // Greeting
    if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey") || lowerQuery === "yo") {
      return `Hey! 👋 Great to meet you! I'm here to help you learn about Aditya's work and experience. 

You can ask me about:
• Projects and portfolio
• Technical skills
• Work experience
• Education
• How to get in touch

What interests you most? 😊`;
    }

    // Thank you
    if (lowerQuery.includes("thank") || lowerQuery.includes("thanks") || lowerQuery.includes("bye") || lowerQuery.includes("goodbye")) {
      return `You're welcome! 🙏 It was great chatting with you. 

Don't hesitate to reach out to Aditya if you'd like to collaborate or have any opportunities. Have a fantastic day! 👋✨`;
    }

    // Default response
    return `That's an interesting question! 🤔 

While I might not have a specific answer for that, here's what I can help you with:

• **Projects**: Ask about my portfolio and GitHub repos
• **Skills**: Technical stack and expertise areas  
• **Experience**: Work history and internships
• **Contact**: How to reach out for opportunities

Try asking something like "What are your top projects?" or "Tell me about your skills" 💡`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const response = generateResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
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
                <p className="text-xs text-white/80">Powered by GitHub • Always online</p>
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
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (only show when few messages) */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
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
                  className="flex-1 px-4 py-2.5 text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
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
