# 🔌 API Documentation

Complete API documentation for the portfolio application.

## 📑 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)
- [SDKs & Libraries](#sdks--libraries)
- [Changelog](#changelog)

---

## 🌐 Overview

This API powers the AI chat assistant feature of the portfolio. It provides an endpoint for sending messages and receiving AI-generated responses using Groq's LLaMA 3.3 70B model.

### Key Features

- ✅ AI-powered conversational responses
- ✅ Real-time GitHub data integration
- ✅ Portfolio context awareness
- ✅ Conversation history support
- ✅ Professional response formatting
- ✅ Token usage tracking

### Technology Stack

- **Runtime**: Next.js 16 API Routes
- **AI Provider**: Groq (LLaMA 3.3 70B Versatile)
- **Deployment**: Netlify (Static Site with API Functions)
- **Language**: TypeScript

---

## 🔗 Base URL

### Production

```
https://iaddy.netlify.app/api
```

### Development

```
http://localhost:3000/api
```

---

## 🔐 Authentication

### API Key Configuration

The API uses server-side authentication with Groq API key stored in environment variables.

**Environment Variable**:

```bash
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Security Notes**:

- ✅ API key is never exposed to client
- ✅ All requests are processed server-side
- ✅ No client-side authentication required
- ✅ CORS enabled for same-origin requests only

---

## 📡 Endpoints

### POST /api/chat

Send a message to the AI assistant and receive a response.

#### Request

**Method**: `POST`

**URL**: `/api/chat`

**Headers**:

```http
Content-Type: application/json
```

**Body**:

```typescript
{
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  githubData?: {
    repos?: number;
    followers?: number;
    following?: number;
    languages?: string[];
    topRepos?: Array<{
      name: string;
      description: string;
      language: string;
      stargazers_count: number;
      forks_count: number;
      html_url: string;
    }>;
  };
  currentTime?: string;
}
```

#### Response

**Success (200)**:

```typescript
{
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

**Error (500)**:

```typescript
{
  error: string;
  details?: any;
}
```

#### Example Request

```javascript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [
      {
        role: "user",
        content: "Tell me about your cybersecurity projects",
      },
    ],
    githubData: {
      repos: 42,
      followers: 150,
      following: 50,
      languages: ["TypeScript", "Python", "Rust"],
      topRepos: [
        {
          name: "portfolio",
          description: "Personal portfolio website",
          language: "TypeScript",
          stargazers_count: 25,
          forks_count: 5,
          html_url: "https://github.com/Xenonesis/portfolio",
        },
      ],
    },
    currentTime: "Wednesday, December 31, 2025 at 10:30 AM",
  }),
});

const data = await response.json();
console.log(data.message);
```

#### Example Response

```json
{
  "message": "I have several cybersecurity-focused projects:\n\n→ Network Security Scanner\nA comprehensive tool for scanning networks and identifying vulnerabilities. Built with Python and Scapy, it performs port scanning, service detection, and vulnerability assessment.\n\n→ Encryption Toolkit\nA collection of encryption utilities implementing AES, RSA, and hybrid encryption schemes. Includes secure key management and digital signatures.\n\n→ Security Audit Dashboard\nReal-time monitoring dashboard for security events and logs. Features automated threat detection and alerting systems.\n\nWould you like details about any specific project?",
  "usage": {
    "prompt_tokens": 523,
    "completion_tokens": 187,
    "total_tokens": 710
  }
}
```

---

## 📊 Data Models

### Message Object

Represents a single message in the conversation.

```typescript
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}
```

**Fields**:

| Field     | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| `role`    | string | Yes      | Message sender type  |
| `content` | string | Yes      | Message text content |

**Role Types**:

- `user`: Messages from the user
- `assistant`: AI-generated responses
- `system`: System instructions (managed server-side)

---

### GitHub Data Object

Contains live GitHub statistics and repository information.

```typescript
interface GitHubData {
  repos?: number;
  followers?: number;
  following?: number;
  languages?: string[];
  topRepos?: GitHubRepo[];
}
```

**Fields**:

| Field       | Type         | Required | Description                              |
| ----------- | ------------ | -------- | ---------------------------------------- |
| `repos`     | number       | No       | Total public repositories                |
| `followers` | number       | No       | GitHub followers count                   |
| `following` | number       | No       | Following count                          |
| `languages` | string[]     | No       | Programming languages used               |
| `topRepos`  | GitHubRepo[] | No       | Top repositories (sorted by recent push) |

---

### GitHub Repository Object

```typescript
interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}
```

**Fields**:

| Field              | Type   | Required | Description                  |
| ------------------ | ------ | -------- | ---------------------------- |
| `name`             | string | Yes      | Repository name              |
| `description`      | string | Yes      | Repository description       |
| `language`         | string | Yes      | Primary programming language |
| `stargazers_count` | number | Yes      | Number of stars              |
| `forks_count`      | number | Yes      | Number of forks              |
| `html_url`         | string | Yes      | Repository URL               |

---

### Usage Object

Token usage statistics from the AI model.

```typescript
interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

**Fields**:

| Field               | Type   | Description                 |
| ------------------- | ------ | --------------------------- |
| `prompt_tokens`     | number | Tokens used in the prompt   |
| `completion_tokens` | number | Tokens used in the response |
| `total_tokens`      | number | Total tokens consumed       |

---

### Error Response Object

```typescript
interface ErrorResponse {
  error: string;
  details?: any;
}
```

**Fields**:

| Field     | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `error`   | string | Human-readable error message |
| `details` | any    | Optional error details       |

---

## ⚠️ Error Handling

### Error Codes

| Status Code | Error Type            | Description                     |
| ----------- | --------------------- | ------------------------------- |
| `200`       | Success               | Request successful              |
| `400`       | Bad Request           | Invalid request format          |
| `500`       | Internal Server Error | Server-side error               |
| `502`       | Bad Gateway           | Groq API error                  |
| `503`       | Service Unavailable   | Service temporarily unavailable |

### Error Messages

#### Missing API Key

```json
{
  "error": "Groq API key not configured"
}
```

**Cause**: `GROQ_API_KEY` environment variable is not set.

**Solution**: Configure the API key in your environment variables.

---

#### AI Response Failed

```json
{
  "error": "Failed to get AI response",
  "details": {
    "status": 429,
    "message": "Rate limit exceeded"
  }
}
```

**Cause**: Groq API rate limit exceeded or API error.

**Solution**: Wait for rate limit to reset or check API status.

---

#### Invalid Request Format

```json
{
  "error": "Invalid request format",
  "details": {
    "field": "messages",
    "message": "messages must be an array"
  }
}
```

**Cause**: Request body doesn't match expected format.

**Solution**: Verify request body structure matches API specification.

---

### Error Handling Best Practices

```typescript
try {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error("API Error:", error);

  // Handle specific error types
  if (error.message.includes("Rate limit")) {
    // Show rate limit message to user
  } else if (error.message.includes("API key")) {
    // Show configuration error
  } else {
    // Show generic error message
  }

  return null;
}
```

---

## 🚦 Rate Limiting

### Groq API Limits

The API is subject to Groq's rate limits:

**Free Tier**:

- **Requests**: 30 requests/minute
- **Tokens**: 14,400 tokens/minute
- **Daily**: 14,400 requests/day

**Recommended Practices**:

- ✅ Implement client-side debouncing
- ✅ Cache responses when possible
- ✅ Show loading states to prevent duplicate requests
- ✅ Handle rate limit errors gracefully

### Client-Side Rate Limiting

```typescript
// Debounce user input
const debouncedSend = useCallback(
  debounce(async (message: string) => {
    await sendMessage(message);
  }, 500),
  [],
);

// Prevent duplicate requests
const [isLoading, setIsLoading] = useState(false);

const handleSend = async () => {
  if (isLoading) return;

  setIsLoading(true);
  try {
    await sendMessage(input);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📚 Examples

### Basic Chat Example

```typescript
// Simple message
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Hello!" }],
  }),
});

const data = await response.json();
console.log(data.message); // "Hello! How can I help you today?"
```

---

### Conversation History Example

```typescript
// Multi-turn conversation
const messages = [
  { role: "user", content: "What projects have you worked on?" },
  { role: "assistant", content: "I have several projects including..." },
  { role: "user", content: "Tell me more about the first one" },
];

const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages }),
});

const data = await response.json();
```

---

### With GitHub Data Example

```typescript
// Fetch GitHub data
const githubUser = await fetch("https://api.github.com/users/Xenonesis");
const userData = await githubUser.json();

const githubRepos = await fetch(
  "https://api.github.com/users/Xenonesis/repos?sort=pushed&per_page=5",
);
const reposData = await githubRepos.json();

// Send to AI with GitHub context
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "What are your most recent projects?" }],
    githubData: {
      repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      topRepos: reposData.map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        html_url: repo.html_url,
      })),
    },
    currentTime: new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }),
  }),
});
```

---

### React Hook Example

```typescript
import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };

      setMessages([...newMessages, assistantMessage]);
      return assistantMessage;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};

// Usage in component
function ChatComponent() {
  const { messages, isLoading, sendMessage } = useChat();

  const handleSend = async () => {
    await sendMessage('Hello!');
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
      <button onClick={handleSend} disabled={isLoading}>
        Send
      </button>
    </div>
  );
}
```

---

## 🛠️ SDKs & Libraries

### TypeScript/JavaScript

#### Fetch API (Built-in)

```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages }),
});
const data = await response.json();
```

#### Axios

```typescript
import axios from "axios";

const { data } = await axios.post("/api/chat", {
  messages: [{ role: "user", content: "Hello" }],
});
console.log(data.message);
```

#### SWR (React)

```typescript
import useSWR from "swr";

const fetcher = (url: string, messages: Message[]) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  }).then((r) => r.json());

function useChat(messages: Message[]) {
  const { data, error, mutate } = useSWR(["/api/chat", messages], ([url, messages]) =>
    fetcher(url, messages),
  );

  return {
    response: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
```

---

## 🧪 Testing

### cURL Examples

#### Basic Request

```bash
curl -X POST https://iaddy.netlify.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What technologies do you use?"
      }
    ]
  }'
```

#### With GitHub Data

```bash
curl -X POST https://iaddy.netlify.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Tell me about your projects"
      }
    ],
    "githubData": {
      "repos": 42,
      "followers": 150,
      "topRepos": [
        {
          "name": "portfolio",
          "description": "Personal portfolio",
          "language": "TypeScript",
          "stargazers_count": 25,
          "forks_count": 5,
          "html_url": "https://github.com/Xenonesis/portfolio"
        }
      ]
    }
  }'
```

### Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Portfolio API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Chat - Basic",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"Hello!\"\n    }\n  ]\n}"
        },
        "url": {
          "raw": "https://iaddy.netlify.app/api/chat",
          "protocol": "https",
          "host": ["iaddy", "netlify", "app"],
          "path": ["api", "chat"]
        }
      }
    }
  ]
}
```

---

## 🔍 Portfolio Context

The AI assistant has built-in knowledge about:

### Personal Information

- Name: Aditya Kumar Tiwari
- Title: Cybersecurity Specialist & Full-Stack Developer
- Location: Delhi, India
- Contact: itisaddy7@gmail.com

### Education

- BCA in Cybersecurity
- Sushant University (2022-2025)

### Projects (6 Total)

Each with:

- Name and description
- Technologies used
- GitHub repository
- Live demo links

### Work Experience (4 Positions)

Each with:

- Company name
- Role and duration
- Key responsibilities
- Technologies used

### Skills (40+ Total)

Organized by category:

- Languages
- Frameworks
- Databases
- Tools
- Cloud Platforms
- Cybersecurity Tools

### Communication Style

- Professional and concise
- No cartoon emojis
- Uses professional symbols: → • ✓ ★ ◆
- Structured formatting

---

## 📊 Performance

### Response Times

| Metric        | Average | 95th Percentile |
| ------------- | ------- | --------------- |
| API Latency   | 800ms   | 1.2s            |
| Groq Response | 600ms   | 1.0s            |
| Total Time    | 1.4s    | 2.2s            |

### Token Usage

| Message Type     | Avg Prompt Tokens | Avg Completion Tokens |
| ---------------- | ----------------- | --------------------- |
| Simple question  | 450               | 150                   |
| Detailed query   | 550               | 300                   |
| With GitHub data | 650               | 250                   |

### Optimization Tips

- ✅ Send only last 8 messages (history limit)
- ✅ Minimize GitHub data payload
- ✅ Cache responses on client side
- ✅ Use optimistic UI updates

---

## 📝 API Changelog

### Version 2.0.0 (2025-12-31)

- ✨ Added GitHub data integration
- ✨ Added token usage tracking
- ✨ Enhanced portfolio context (257 lines)
- 🔄 Updated to Groq LLaMA 3.3 70B
- 🔄 Improved response formatting
- 🐛 Fixed conversation history handling

### Version 1.0.0 (2025-10-01)

- ✨ Initial API release
- ✨ Basic chat functionality
- ✨ Portfolio context integration

---

## 🔐 Security

### Best Practices

1. **Never expose API keys client-side**

   ```typescript
   // ❌ BAD
   const apiKey = "gsk_xxxxx";

   // ✅ GOOD
   // Use environment variables server-side only
   const apiKey = process.env.GROQ_API_KEY;
   ```

2. **Validate input**

   ```typescript
   if (!messages || !Array.isArray(messages)) {
     return Response.json({ error: "Invalid messages" }, { status: 400 });
   }
   ```

3. **Sanitize user content**

   ```typescript
   const sanitizedContent = content.trim().slice(0, 500);
   ```

4. **Implement rate limiting**
   ```typescript
   // Track requests per IP/session
   // Reject if exceeds threshold
   ```

---

## 📞 Support

### Getting Help

- 📧 **Email**: itisaddy7@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/Xenonesis/portfolio/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Xenonesis/portfolio/discussions)

### Reporting Issues

When reporting API issues, include:

- Request payload (sanitized)
- Response received
- Expected behavior
- Environment (browser, OS)
- Network logs (if available)

---

<div align="center">

## 📖 Related Documentation

- [README.md](./README.md) - Project overview
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [CHANGELOG.md](./CHANGELOG.md) - Version history

---

**Made with 💙 by [Aditya Kumar Tiwari](https://github.com/Xenonesis)**

**[⬆ Back to Top](#-api-documentation)**

---

_Last Updated: December 31, 2025_

</div>
