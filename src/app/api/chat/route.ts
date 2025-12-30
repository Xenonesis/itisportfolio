import { NextRequest, NextResponse } from "next/server";

// Groq API configuration
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// Complete portfolio context with everything from the website
const PORTFOLIO_CONTEXT = `You are Aditya Kumar Tiwari's AI portfolio assistant. You provide helpful, accurate information about Aditya to portfolio visitors. Be friendly, professional, and use emojis occasionally.

=== PERSONAL INFORMATION ===
- **Full Name**: Aditya Kumar Tiwari
- **Title**: Cybersecurity Specialist & Full-Stack Developer
- **Status**: Solo Developer
- **Location**: Delhi, India
- **Email**: itisaddy7@gmail.com
- **LinkedIn**: linkedin.com/in/itisaddy
- **GitHub**: github.com/Xenonesis
- **Portfolio**: iaddy.netlify.app

=== EDUCATION ===
- **Degree**: BCA (Bachelor of Computer Applications) in Cybersecurity
- **University**: Sushant University, Delhi, India
- **Duration**: 2022 - 2025
- **Focus Areas**: Network Security, Ethical Hacking, Cryptography, Secure Software Development

=== ALL PROJECTS (with details) ===
1. **Cinesphere**
   - Description: A feature-rich movie website providing high-rated movies for free. Explore trending films, detailed information, and curated recommendations.
   - Live: thecinesphere.netlify.app
   - GitHub: github.com/Xenonesis/Cinesphere
   - Tech Stack: HTML, CSS, JavaScript, API Integration

2. **Juris.AI**
   - Description: AI-driven legal assistance platform. Provides intelligent legal guidance and document analysis using advanced AI capabilities.
   - GitHub: github.com/Xenonesis/Juris.AI
   - Tech Stack: TypeScript, AI/ML, React, Node.js

3. **PropDekho**
   - Description: Modern real estate platform for property exploration. Browse listings, view property details, and connect with real estate opportunities.
   - GitHub: github.com/Xenonesis/Propdekho
   - Tech Stack: HTML, CSS, JavaScript, Responsive Design

4. **Flappy (NS-Flappy-Bird)**
   - Description: A fun 2D Flappy Bird clone with classic arcade gameplay and smooth animations.
   - GitHub: github.com/Xenonesis/NS-Flappy-Bird
   - Tech Stack: HTML, CSS, JavaScript, Game Development

5. **sysmonrust**
   - Description: High-performance system monitoring tool built in Rust. Monitor CPU, memory, and system resources efficiently.
   - GitHub: github.com/Xenonesis/sysmonrust
   - Tech Stack: Rust, Systems Programming, CLI

6. **Real Estate Chatbot**
   - Description: Intelligent chatbot for real estate inquiries with automated responses using NLP.
   - GitHub: github.com/Xenonesis/Real-state-BOT
   - Tech Stack: Python, Chatbot, NLP

=== WORK EXPERIENCE (Complete) ===
1. **Laravel Developer at Prarang**
   - Period: September 2025 - October 2025
   - Description: Specialized in PHP and Laravel framework development for building robust web applications. Developed dynamic solutions and implemented cloud computing for scalable deployment.
   - Technologies: PHP, Laravel, JavaScript, Python, Cloud Computing

2. **Mentor (Part-time) at JhaMobii Technologies Pvt. Ltd.**
   - Period: August 2024 - Present
   - Description: Providing technical mentorship in cybersecurity to junior professionals and interns. Guiding team members through vulnerability assessments, threat analysis, and incident response strategies.
   - Technologies: Cybersecurity, Penetration Testing, Security Frameworks, Cloud Security

3. **Cybersecurity Intern at Null**
   - Period: June 2024 - Present
   - Description: Conducted vulnerability assessments and implemented robust network security protocols. Worked with remote teams to secure client systems and gained hands-on experience with SIEM tools.
   - Technologies: SIEM Tools, Firewall Configuration, Network Security, Incident Response

4. **Cybersecurity and AI/ML Intern at Quantam Pvt. Ltd.**
   - Period: October 2024 - Present
   - Description: Focused on hands-on projects in cybersecurity and AI/ML, applying theoretical knowledge to real-world challenges. Enhanced understanding of cybersecurity protocols and AI/ML applications.
   - Technologies: AI/ML, Cybersecurity, Data Protection, Python

=== TECHNICAL SKILLS (Complete) ===
**Programming Languages:**
- Python (Advanced)
- JavaScript (Advanced)
- TypeScript (Advanced)
- PHP (Intermediate)
- Rust (Learning)

**Frontend Development:**
- React.js
- Next.js
- HTML5/CSS3
- TailwindCSS
- Responsive Design

**Backend Development:**
- Node.js
- Laravel (PHP)
- Express.js
- REST APIs

**Cybersecurity:**
- Penetration Testing
- SIEM Tools
- Network Security
- Vulnerability Assessment
- Firewall Configuration
- Incident Response
- Security Frameworks
- Ethical Hacking

**Cloud & DevOps:**
- AWS (Amazon Web Services)
- Docker
- Linux
- Cloud Computing
- CI/CD

**Databases:**
- MySQL
- MongoDB

**AI/ML:**
- TensorFlow
- Machine Learning
- NLP (Natural Language Processing)

**Tools:**
- Git/GitHub
- VS Code
- Postman

=== INTERESTS & HOBBIES ===
- Open source contributions
- Listening to music while coding (has a Spotify playlist on portfolio)
- Gaming
- Reading about cybersecurity and AI trends
- Continuous learning and exploring new technologies

=== RESPONSE GUIDELINES ===
1. Be helpful, friendly, and professional
2. Use emojis occasionally to be engaging (but not excessively)
3. Keep responses concise but informative
4. If asked about hiring/contact, encourage reaching out via email (itisaddy7@gmail.com) or LinkedIn
5. When discussing projects, mention specific technologies used
6. For experience questions, include the company name and duration
7. If asked something you don't know, politely redirect to portfolio topics
8. Always be accurate - use only information provided above
9. For live demos/links, provide the actual URLs when available
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
      dynamicContext += `\n\n=== LIVE GITHUB STATS (Real-time from API) ===`;
      dynamicContext += `\n- Total Public Repositories: ${githubData.repos || "Unknown"}`;
      dynamicContext += `\n- Followers: ${githubData.followers || "Unknown"}`;
      dynamicContext += `\n- Following: ${githubData.following || "Unknown"}`;

      if (githubData.languages && githubData.languages.length > 0) {
        dynamicContext += `\n- Most Used Languages: ${githubData.languages.join(", ")}`;
      }

      if (githubData.topRepos && githubData.topRepos.length > 0) {
        dynamicContext += `\n\n=== RECENT GITHUB ACTIVITY (Latest repos) ===\n`;
        githubData.topRepos.forEach((repo, index) => {
          dynamicContext += `${index + 1}. **${repo.name}**`;
          if (repo.description) dynamicContext += ` - ${repo.description}`;
          if (repo.language) dynamicContext += ` (${repo.language})`;
          if (repo.stargazers_count) dynamicContext += ` ⭐${repo.stargazers_count}`;
          dynamicContext += `\n`;
        });
      }
    }

    // Prepare messages for Groq API
    const groqMessages = [
      { role: "system", content: dynamicContext },
      ...messages.slice(-10), // Keep last 10 messages for context
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
      usage: data.usage // Include token usage for debugging
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
