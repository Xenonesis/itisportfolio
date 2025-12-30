"use client";

import SocialMedia from "@/components/SocialMedia";
import { AnimateIn } from "@/components/animations/AnimateIn";
import { Tooltip } from "@/components/Tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GitHubContributions } from "@/components/GitHubContributions";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function Home() {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const initialProjectCount = 3;
  const visibleProjects = isProjectsExpanded
    ? projects
    : projects.slice(0, initialProjectCount);

  const [isExperienceExpanded, setIsExperienceExpanded] = useState(false);
  const initialExperienceCount = 2;
  const visibleExperience = isExperienceExpanded
    ? experience
    : experience.slice(0, initialExperienceCount);
  const handleHeartRain = () => {
    const duration = 3000; // 3 seconds
    const animationEnd = Date.now() + duration;

    // Create a custom heart shape
    const heartShape = confetti.shapeFromText({ text: "🤍", scalar: 2 });

    // Raining effect - hearts falling from top of screen
    const rainConfetti = () => {
      confetti({
        particleCount: 3,
        startVelocity: 0,
        ticks: 300,
        gravity: 0.5,
        origin: {
          x: Math.random(),
          y: -0.1, // Start from above the screen
        },
        shapes: [heartShape],
        scalar: 1.5,
        drift: Math.random() - 0.5, // Add some horizontal drift
        colors: ["#ffffff", "#f8fafc", "#f1f5f9"],
      });
    };

    // Create continuous rain effect
    const rainInterval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(rainInterval);
        return;
      }

      // Create multiple hearts at different positions
      for (let i = 0; i < 5; i++) {
        setTimeout(() => rainConfetti(), i * 100);
      }
    }, 200);

    // Initial burst for immediate effect
    for (let i = 0; i < 20; i++) {
      setTimeout(() => rainConfetti(), i * 50);
    }
  };
  return (
    <main className="text-zinc-800 dark:text-zinc-100 max-w-2xl mx-auto px-6 py-8 mt-4 relative page-transition">
      {/* Subtle content backdrop for readability over dot grid */}
      <div className="absolute inset-0 -z-10 mx-4 rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm" />
      
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-5 right-5 z-50">
        <div className="glass-card p-1.5 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
          <ThemeToggle />
        </div>
      </div>
      
      <AnimateIn variant="fadeUp">
        {" "}
        {/* Spotify Music Section */}{" "}
        <section className="mb-8">
          <AnimateIn variant="fadeUp" delay={0.1}>
            <div className="soft-container overflow-hidden shine-effect">
              <div className="pt-4 px-4 pb-3">
                <div className="flex items-center gap-2.5">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.479.359-.78.719-.84 4.561-1.021 8.52-.621 11.64 1.32.42.18.479.659.301 1.02l-.238.061zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.481.78.241 1.2zm.120-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>                  <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 tracking-wide">
                    Vibing to while I code
                  </h2>
                </div>
              </div>
              <div className="px-3 pb-2">
                <div className="overflow-hidden rounded-xl">                  <iframe
                  style={{ borderRadius: "16px" }}
                  src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full"
                />
                </div>
              </div>
            </div>
          </AnimateIn>
        </section>
        <section className="mb-14">          <AnimateIn variant="fadeUp" delay={0.2}>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4 heading-expressive">
            <span>Hey, I&apos;m Aditya ᯓᡣ𐭩</span>
          </h1>
        </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.4}>
            <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mb-6 leading-relaxed">
              Cybersecurity Specialist & Full-Stack Developer
            </p>
          </AnimateIn>{" "}          <AnimateIn variant="fadeUp" delay={0.5}>
            <div className="flex items-center gap-3 mb-6">
              {/* <Tooltip content="Some of my Random awesome memories">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Gallery
                </Link>
              </Tooltip>{" "} */}
              <Tooltip content="Hire me please 🥺">
                <a
                  href="/Aditya.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-soft inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20 border border-teal-400/30 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 text-sm font-medium rounded-xl hover:from-teal-500/15 hover:to-cyan-500/15 dark:hover:from-teal-500/25 dark:hover:to-cyan-500/25 focus-ring"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Resume
                </a>
              </Tooltip>
            </div>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.6}>
            <div className="flex items-center gap-6">
              <SocialMedia />
            </div>
          </AnimateIn>{" "}
        </section>
      </AnimateIn>      <AnimateIn variant="fadeUp" delay={0.2}>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Education Section */}
        <section className="mb-14">
          <AnimateIn variant="reveal" delay={0.25}>
            <h2 className="text-xl font-semibold tracking-tight mb-5 inline-block heading-expressive">
              Education<span className="text-teal-500 dark:text-teal-400 ml-1">▼</span>
            </h2>
          </AnimateIn>
          <div className="space-y-6">
            <AnimateIn variant="fadeLeft" delay={0.3}>
              <div className="group soft-container p-5 hover-lift">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h3 className="text-lg font-medium">
                    BCA in Cybersecurity
                  </h3>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                    2022 - 2025
                  </span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Sushant University, Delhi, India
                </p>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Projects */}
      </AnimateIn>      <AnimateIn variant="fadeUp" delay={0.3}>
        <section className="mb-14">
          <AnimateIn variant="reveal" delay={0.35}>
            <h2 className="text-xl font-semibold tracking-tight mb-6 inline-block heading-expressive">
              Projects<span className="text-teal-500 dark:text-teal-400 ml-1">▼</span>
            </h2>
          </AnimateIn>
          <div className="space-y-5">
            {" "}
            <ul className="space-y-5">
              {visibleProjects.map((project, index) => {
                const delay =
                  isProjectsExpanded && index >= initialProjectCount
                    ? 0.35 + (index - initialProjectCount) * 0.1
                    : 0.35 + index * 0.1;
                return (
                  <AnimateIn key={index} variant="fadeLeft" delay={delay}>
                    <li className="soft-container p-5 hover-lift shine-effect">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-medium">{project.title}</h3>
                        <div className="flex flex-row gap-3">
                          {project.github ? (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium"
                            >
                              GitHub <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : null}
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-coral-500 dark:hover:text-orange-400 transition-colors font-medium"
                            >
                              View <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-teal-500/8 to-cyan-500/8 dark:from-teal-500/15 dark:to-cyan-500/15 text-zinc-600 dark:text-zinc-400 border border-teal-500/10 dark:border-teal-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </li>
                  </AnimateIn>
                );
              })}
            </ul>
            {projects.length > initialProjectCount && (
              <button
                onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 mx-auto font-medium py-3 px-5 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
              >
                {isProjectsExpanded ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show More Projects <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />
      </AnimateIn>{" "}      <AnimateIn variant="fadeUp" delay={0.4}>
        <section className="mb-14">
          <AnimateIn variant="reveal" delay={0.45}>
            <h2 className="text-xl font-semibold tracking-tight mb-6 inline-block heading-expressive">
              Experience<span className="text-coral-500 dark:text-orange-400 ml-1">▼</span>
            </h2>
          </AnimateIn>
          <div className="space-y-5">
            <ul className="space-y-5">
              {visibleExperience.map((job, index) => {
                const delay =
                  0.45 +
                  (index < initialExperienceCount
                    ? index
                    : index - initialExperienceCount) *
                  0.1;
                return (
                  <AnimateIn key={index} variant="fadeLeft" delay={delay}>
                    <li className="soft-container p-5 hover-lift shine-effect">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-1">
                        <h3 className="text-lg font-medium">
                          {job.role} {job.role === "Freelance" ? "" : "at"}{" "}
                          <span className="text-teal-600 dark:text-teal-400">{job.company}</span>
                        </h3>
                        <span className="text-sm text-zinc-400 dark:text-zinc-500 font-medium whitespace-nowrap">
                          {job.period}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-orange-500/8 to-amber-500/8 dark:from-orange-500/15 dark:to-amber-500/15 text-zinc-600 dark:text-zinc-400 border border-orange-500/10 dark:border-orange-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </li>
                  </AnimateIn>
                );
              })}
            </ul>
            {experience.length > initialExperienceCount && (
              <button
                onClick={() => setIsExperienceExpanded(!isExperienceExpanded)}
                className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 mx-auto font-medium py-3 px-5 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
              >
                {isExperienceExpanded ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show More Experience <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />
      </AnimateIn>{" "}      <AnimateIn variant="fadeUp" delay={0.6}>
        <section className="mb-14">
          <AnimateIn variant="reveal" delay={0.65}>
            <h2 className="text-xl font-semibold tracking-tight mb-6 inline-block heading-expressive">
              Tools & Stack<span className="text-purple-500 dark:text-purple-400 ml-1">▼</span>
            </h2>
          </AnimateIn>
          <div className="soft-container p-6">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
              {tools.map(({ logo, title }, index) => (
                <AnimateIn
                  key={index}
                  variant="scale"
                  delay={0.65 + index * 0.03}
                >
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div className="relative h-8 w-8 sm:h-10 sm:w-10 mb-2 p-2 rounded-xl bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-700/50 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo}
                        alt={`${title} logo`}
                        className="object-contain w-full h-full drop-shadow-sm"
                        loading="eager"
                      />
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 text-center whitespace-nowrap font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                      {title}
                    </span>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider" />

        {/* GitHub Contributions */}
        <GitHubContributions />
        {/* </AnimateIn>{" "}      <AnimateIn variant="fadeUp" delay={0.8}> */}
        {/* <section className="mb-10">
          <AnimateIn variant="reveal" delay={0.85}>
            <h2 className="text-lg font-medium tracking-tight mb-3 inline-block">
              Achievements▼
            </h2>
          </AnimateIn>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <AnimateIn
                key={index}
                variant="fadeLeft"
                delay={0.85 + index * 0.1}
              >
                <div className="group hover:translate-x-1 transition-all duration-300 ease-out">
                  <div className="flex items-start gap-3">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                      🏆
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {achievement.event}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </section> */}

        {/* Section Divider */}
        <div className="section-divider" />

        {/* </AnimateIn>{" "}      <AnimateIn variant="fadeUp" delay={1.0}> */}
        <section className="mb-12">
          <AnimateIn variant="reveal" delay={1.05}>
            <div className="text-center glass-card p-8 rounded-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 heading-expressive">
                Get in Touch
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
                DM me on{" "}
                <a
                  href="mailto:itisaddy7@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors font-medium underline decoration-teal-500/30 underline-offset-2 hover:decoration-teal-500"
                >
                  Email
                </a>
                {" or "}
                <a
                  href="https://www.linkedin.com/in/itisaddy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors font-medium underline decoration-teal-500/30 underline-offset-2 hover:decoration-teal-500"
                >
                  LinkedIn
                </a>{" "}
                if you want to chat or collaborate on cybersecurity or development projects!
              </p>
            </div>
          </AnimateIn>
        </section>
      </AnimateIn>      <AnimateIn variant="fadeUp" delay={1.2}>
        {" "}
        <footer className="pt-6 pb-4 text-sm text-zinc-500 dark:text-zinc-400 flex justify-between items-center relative glass-card px-6 py-4 rounded-2xl mb-4">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-purple-500/5 dark:from-teal-500/3 dark:to-purple-500/3"></div>
          </div>

          <Link
            href="https://iaddy.netlify.app"
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-2 relative z-10 font-medium"
          >
            iaddy.netlify.app
          </Link>
          <div
            onClick={handleHeartRain}
            className="cursor-pointer hover:text-coral-600 dark:hover:text-orange-400 transition-all select-none hover:scale-105 transform duration-300 relative z-10 font-medium"
            title="Click for some love rain!"
          >
            Built with <span className="text-xl animate-pulse">♥</span>
          </div>
        </footer>
      </AnimateIn>
    </main>
  );
}

const projects = [
  {
    title: "Cinesphere",
    description:
      "A feature-rich movie website providing high-rated movies for free. Explore trending films, detailed information, and curated recommendations for entertainment enthusiasts.",
    link: "https://thecinesphere.netlify.app/",
    github: "https://github.com/Xenonesis/Cinesphere",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "API Integration"
    ]
  },
  {
    title: "Juris.AI",
    description:
      "AI-driven legal assistance platform built with TypeScript. Provides intelligent legal guidance and document analysis using advanced AI capabilities.",
    link: "",
    github: "https://github.com/Xenonesis/Juris.AI",
    technologies: [
      "TypeScript",
      "AI/ML",
      "React",
      "Node.js"
    ]
  },
  {
    title: "PropDekho",
    description:
      "Modern real estate platform for property exploration. Browse listings, view property details, and connect with real estate opportunities.",
    link: "",
    github: "https://github.com/Xenonesis/Propdekho",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Responsive Design"
    ]
  },
  {
    title: "Flappy",
    description:
      "A fun 2D Flappy Bird clone built using vanilla HTML, CSS, and JavaScript. Classic arcade gameplay with smooth animations.",
    link: "",
    github: "https://github.com/Xenonesis/NS-Flappy-Bird.git",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Game Development"
    ]
  },
  {
    title: "sysmonrust",
    description:
      "High-performance system monitoring tool built in Rust. Monitor CPU, memory, and system resources with a lightweight and efficient solution.",
    link: "",
    github: "https://github.com/Xenonesis/sysmonrust",
    technologies: [
      "Rust",
      "Systems Programming",
      "CLI"
    ]
  },
  {
    title: "Real Estate Chatbot",
    description:
      "Intelligent chatbot for real estate inquiries. Provides automated responses and assistance for property-related questions.",
    link: "",
    github: "https://github.com/Xenonesis/Real-state-BOT.git",
    technologies: [
      "Python",
      "Chatbot",
      "NLP"
    ]
  },
];




const experience = [
  {
    role: "Laravel Developer",
    company: "Prarang",
    period: "Sept 2025 - Oct 2025",
    description:
      "Specialized in PHP and Laravel framework development for building robust web applications. Developed dynamic solutions and implemented cloud computing for scalable deployment.",
    technologies: [
      "PHP",
      "Laravel",
      "JavaScript",
      "Python",
      "Cloud Computing",
    ],
  },
  {
    role: "Mentor (Part-time)",
    company: "JhaMobii Technologies Pvt. Ltd.",
    period: "Aug 2024 - Present",
    description:
      "Providing technical mentorship in cybersecurity to junior professionals and interns. Guiding team members through vulnerability assessments, threat analysis, and incident response strategies.",
    technologies: [
      "Cybersecurity",
      "Penetration Testing",
      "Security Frameworks",
      "Cloud Security",
    ],
  },
  {
    role: "Cybersecurity Intern",
    company: "Null",
    period: "Jun 2024 - Present",
    description:
      "Conducted vulnerability assessments and implemented robust network security protocols. Worked with remote teams to secure client systems and gained hands-on experience with SIEM tools.",
    technologies: [
      "SIEM Tools",
      "Firewall Configuration",
      "Network Security",
      "Incident Response",
    ],
  },
  {
    role: "Cybersecurity and AI/ML Intern",
    company: "Quantam Pvt. Ltd.",
    period: "Oct 2024 - Present",
    description:
      "Focused on hands-on projects in cybersecurity and AI/ML, applying theoretical knowledge to real-world challenges. Enhanced understanding of cybersecurity protocols and AI/ML applications.",
    technologies: [
      "AI/ML",
      "Cybersecurity",
      "Data Protection",
      "Python",
    ],
  },
];


const tools = [
  // Programming Languages
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    title: "Python",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    title: "JavaScript",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    title: "PHP",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
    title: "Rust",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    title: "TypeScript",
  },

  // Web Development
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    title: "HTML",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    title: "CSS",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    title: "Laravel",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    title: "React",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    title: "Node.js",
  },

  // Cloud & DevOps
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    title: "AWS",
  },
  {
    logo: "https://res.cloudinary.com/deczqhug9/image/upload/v1756794076/docker-logo_enztlc.png",
    title: "Docker",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    title: "Linux",
  },

  // Database & Tools
  {
    logo: "https://www.vectorlogo.zone/logos/mysql/mysql-official.svg",
    title: "MySQL",
  },
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    title: "Git",
  },

  // AI/ML
  {
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    title: "TensorFlow",
  },
];
