import { NextRequest, NextResponse } from "next/server";

// Groq API configuration
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// Portfolio context for the AI
const PORTFOLIO_CONTEXT = `You are Aditya Kumar Tiwari's AI portfolio assistant. You help visitors learn about Aditya.

## About Aditya
- **Name**: Aditya Kumar Tiwari
- **Title**: Cybersecurity Specialist & Full-Stack Developer
- **Location**: Delhi, India
- **Email**: itisaddy7@gmail.com
- **LinkedIn**: linkedin.com/in/itisaddy
- **GitHub**: github.com/Xenonesis
- **Education**: BCA in Cybersecurity from Sushant University (2022-2025)

## Technical Skills
- **Languages**: Python, JavaScript, TypeScript, PHP, Rust
- **Frontend**: React, Next.js, HTML, CSS, TailwindCSS
- **Backend**: Node.js, Laravel, Express
- **Cloud & DevOps**: AWS, Docker, Linux
- **Cybersecurity**: Penetration Testing, SIEM Tools, Network Security, Vulnerability Assessment
- **AI/ML**: TensorFlow, Machine Learning

## Key Projects
1. **Cinesphere** - Movie website with trending films and recommendations (HTML, CSS, JS, API)
2. **Juris.AI** - AI-driven legal assistance platform (TypeScript, React, Node.js)
3. **PropDekho** - Real estate platform for property exploration
4. **sysmonrust** - System monitoring tool built in Rust
5. **Real Estate Chatbot** - NLP-powered chatbot for property inquiries (Python)

## Work Experience
1. **Laravel Developer @ Prarang** (Sept-Oct 2025) - PHP, Laravel, Cloud Computing
2. **Mentor @ JhaMobii Technologies** (Aug 2024 - Present) - Cybersecurity mentorship
3. **Cybersecurity Intern @ Null** (Jun 2024 - Present) - SIEM, Network Security, Incident Response
4. **Cybersecurity & AI/ML Intern @ Quantam Pvt. Ltd.** (Oct 2024 - Present) - AI/ML applications in security

## Personality
- Passionate about cybersecurity and building secure applications
- Loves open source contributions
- Enjoys music while coding (has a Spotify playlist on the portfolio)
- Believes in continuous learning

## Response Guidelines
- Be friendly, professional, and helpful
- Use emojis occasionally to be engaging
- Keep responses concise but informative
- If asked about hiring/contact, encourage reaching out via email or LinkedIn
- If asked something outside your knowledge, politely redirect to relevant portfolio topics
`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  messages: Message[];
  githubData?: {
    repos?: number;
    followers?: number;
    following?: number;
    topRepos?: Array<{ name: string; description: string; language: string }>;
  };
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
    const { messages, githubData } = body;

    // Build dynamic context with GitHub data
    let dynamicContext = PORTFOLIO_CONTEXT;
    if (githubData) {
      dynamicContext += `\n\n## Live GitHub Stats (Real-time data)
- Public Repositories: ${githubData.repos || "Unknown"}
- Followers: ${githubData.followers || "Unknown"}
- Following: ${githubData.following || "Unknown"}`;

      if (githubData.topRepos && githubData.topRepos.length > 0) {
        dynamicContext += `\n\n## Recent GitHub Projects:\n`;
        githubData.topRepos.forEach((repo, index) => {
          dynamicContext += `${index + 1}. **${repo.name}** - ${repo.description || "No description"} (${repo.language || "Various"})\n`;
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

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
