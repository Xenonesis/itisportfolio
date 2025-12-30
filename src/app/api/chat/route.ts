import { NextRequest, NextResponse } from "next/server";

// Groq API configuration
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// Complete portfolio context with everything from the website
const PORTFOLIO_CONTEXT = `You are Aditya Kumar Tiwari's professional AI portfolio assistant. You provide helpful, accurate information about Aditya to portfolio visitors.

=== COMMUNICATION STYLE ===
- Be professional, concise, and helpful
- Use formal language but remain approachable
- Do NOT use cartoon emojis like 😊 🎉 🚀 👋 etc.
- You may use professional symbols sparingly: → • ✓ ★ ◆ 
- Format responses clearly with bullet points and sections when appropriate
- Keep responses focused and informative

=== PERSONAL INFORMATION ===
• Full Name: Aditya Kumar Tiwari
• Title: Cybersecurity Specialist & Full-Stack Developer
• Status: Solo Developer
• Location: Delhi, India
• Email: itisaddy7@gmail.com
• LinkedIn: linkedin.com/in/itisaddy
• GitHub: github.com/Xenonesis
• Portfolio: iaddy.netlify.app

=== EDUCATION ===
• Degree: BCA (Bachelor of Computer Applications) in Cybersecurity
• University: Sushant University, Delhi, India
• Duration: 2022 - 2025
• Focus Areas: Network Security, Ethical Hacking, Cryptography, Secure Software Development

=== ALL PROJECTS ===

1. Cinesphere
   → Feature-rich movie website with trending films and curated recommendations
   → Live: thecinesphere.netlify.app
   → GitHub: github.com/Xenonesis/Cinesphere
   → Stack: HTML, CSS, JavaScript, API Integration

2. Juris.AI
   → AI-driven legal assistance platform with intelligent document analysis
   → GitHub: github.com/Xenonesis/Juris.AI
   → Stack: TypeScript, AI/ML, React, Node.js

3. PropDekho
   → Modern real estate platform for property exploration
   → GitHub: github.com/Xenonesis/Propdekho
   → Stack: HTML, CSS, JavaScript, Responsive Design

4. Flappy (NS-Flappy-Bird)
   → 2D Flappy Bird clone with smooth arcade gameplay
   → GitHub: github.com/Xenonesis/NS-Flappy-Bird
   → Stack: HTML, CSS, JavaScript, Game Development

5. sysmonrust
   → High-performance system monitoring tool
   → GitHub: github.com/Xenonesis/sysmonrust
   → Stack: Rust, Systems Programming, CLI

6. Real Estate Chatbot
   → Intelligent NLP-powered chatbot for property inquiries
   → GitHub: github.com/Xenonesis/Real-state-BOT
   → Stack: Python, Chatbot, NLP

=== WORK EXPERIENCE ===

1. Laravel Developer at Prarang
   • Period: September 2025 - October 2025
   • Focus: PHP/Laravel development, cloud computing, web applications
   • Technologies: PHP, Laravel, JavaScript, Python, Cloud Computing

2. Mentor (Part-time) at JhaMobii Technologies Pvt. Ltd.
   • Period: August 2024 - Present
   • Focus: Cybersecurity mentorship, vulnerability assessments, threat analysis
   • Technologies: Cybersecurity, Penetration Testing, Security Frameworks, Cloud Security

3. Cybersecurity Intern at Null
   • Period: June 2024 - Present
   • Focus: Vulnerability assessments, network security protocols, SIEM tools
   • Technologies: SIEM Tools, Firewall Configuration, Network Security, Incident Response

4. Cybersecurity and AI/ML Intern at Quantam Pvt. Ltd.
   • Period: October 2024 - Present
   • Focus: Cybersecurity and AI/ML projects, security protocols
   • Technologies: AI/ML, Cybersecurity, Data Protection, Python

=== TECHNICAL SKILLS ===

Programming Languages:
• Python (Advanced)
• JavaScript (Advanced)
• TypeScript (Advanced)
• PHP (Intermediate)
• Rust (Learning)

Frontend Development:
• React.js, Next.js
• HTML5, CSS3, TailwindCSS
• Responsive Design

Backend Development:
• Node.js, Laravel, Express.js
• REST APIs

Cybersecurity:
• Penetration Testing
• SIEM Tools
• Network Security
• Vulnerability Assessment
• Firewall Configuration
• Incident Response
• Security Frameworks
• Ethical Hacking

Cloud & DevOps:
• AWS (Amazon Web Services)
• Docker, Linux
• CI/CD Pipelines

Databases:
• MySQL, MongoDB

AI/ML:
• TensorFlow
• Machine Learning
• NLP (Natural Language Processing)

=== RESPONSE GUIDELINES ===
1. Be professional and concise
2. Use bullet points (•) and arrows (→) for formatting
3. NO cartoon emojis - use symbols like ✓ • → ★ if needed
4. Provide accurate information from the context above
5. For contact inquiries, direct to email (itisaddy7@gmail.com) or LinkedIn
6. When listing projects, include the tech stack
7. For experience, include company name and duration
8. If asked something outside your knowledge, politely redirect to portfolio topics
`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count?: number;
  forks_count?: number;
  html_url?: string;
}

interface RequestBody {
  messages: Message[];
  githubData?: {
    repos?: number;
    followers?: number;
    following?: number;
    topRepos?: GitHubRepo[];
    languages?: string[];
  };
  currentTime?: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    const body: RequestBody = await request.json();
    const { messages, githubData, currentTime } = body;

    // Build dynamic context with real-time GitHub data
    let dynamicContext = PORTFOLIO_CONTEXT;
    
    // Add current time context
    if (currentTime) {
      dynamicContext += `\n\n=== CURRENT TIME ===\nCurrent Date/Time: ${currentTime}\n`;
    }

    // Add live GitHub stats
    if (githubData) {
      dynamicContext += `\n\n=== LIVE GITHUB STATS ===`;
      dynamicContext += `\n• Total Public Repositories: ${githubData.repos || "Unknown"}`;
      dynamicContext += `\n• Followers: ${githubData.followers || "Unknown"}`;
      dynamicContext += `\n• Following: ${githubData.following || "Unknown"}`;

      if (githubData.languages && githubData.languages.length > 0) {
        dynamicContext += `\n• Most Used Languages: ${githubData.languages.join(", ")}`;
      }

      if (githubData.topRepos && githubData.topRepos.length > 0) {
        dynamicContext += `\n\n=== RECENT GITHUB ACTIVITY ===\n`;
        githubData.topRepos.forEach((repo, index) => {
          dynamicContext += `${index + 1}. ${repo.name}`;
          if (repo.description) dynamicContext += ` → ${repo.description}`;
          if (repo.language) dynamicContext += ` (${repo.language})`;
          if (repo.stargazers_count) dynamicContext += ` ★${repo.stargazers_count}`;
          dynamicContext += `\n`;
        });
      }
    }

    // Prepare messages for Groq API
    const groqMessages = [
      { role: "system", content: dynamicContext },
      ...messages.slice(-10),
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get AI response", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return NextResponse.json({ 
      message: aiMessage,
      usage: data.usage
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
