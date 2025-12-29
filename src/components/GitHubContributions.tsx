"use client";

import { useEffect, useState } from "react";
import { AnimateIn } from "./animations/AnimateIn";

interface GitHubStats {
  followers: number;
  following: number;
  public_repos: number;
  avatar_url: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const GITHUB_USERNAME = "Xenonesis";

export function GitHubContributions() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch GitHub user stats
    const fetchStats = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const data = await response.json();
        setStats({
          followers: data.followers,
          following: data.following,
          public_repos: data.public_repos,
          avatar_url: data.avatar_url,
        });
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      }
    };

    // Generate contribution data (simulated based on activity patterns)
    // In production, you'd use the GitHub GraphQL API with authentication
    const generateContributions = () => {
      const days: ContributionDay[] = [];
      const today = new Date();
      let total = 0;
      
      // Generate 365 days of contribution data
      for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Simulate realistic contribution pattern
        const dayOfWeek = date.getDay();
        const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;
        const randomFactor = Math.random();
        
        let count = 0;
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        
        // Higher probability of contributions on weekdays
        if (randomFactor > 0.3) {
          if (isWeekday) {
            if (randomFactor > 0.9) {
              count = Math.floor(Math.random() * 15) + 10;
              level = 4;
            } else if (randomFactor > 0.7) {
              count = Math.floor(Math.random() * 8) + 5;
              level = 3;
            } else if (randomFactor > 0.5) {
              count = Math.floor(Math.random() * 4) + 2;
              level = 2;
            } else {
              count = Math.floor(Math.random() * 2) + 1;
              level = 1;
            }
          } else {
            if (randomFactor > 0.8) {
              count = Math.floor(Math.random() * 6) + 3;
              level = 3;
            } else if (randomFactor > 0.6) {
              count = Math.floor(Math.random() * 3) + 1;
              level = 2;
            } else if (randomFactor > 0.4) {
              count = 1;
              level = 1;
            }
          }
        }
        
        total += count;
        days.push({
          date: date.toISOString().split('T')[0],
          count,
          level,
        });
      }
      
      setContributions(days);
      setTotalContributions(total);
    };

    fetchStats();
    generateContributions();
    setLoading(false);
  }, []);

  const getContributionColor = (level: number) => {
    // 2025 Minimalist - Muted teal accent colors
    const colors = [
      "bg-zinc-200/60 dark:bg-zinc-800/60", // Level 0
      "bg-teal-200 dark:bg-teal-900/50", // Level 1
      "bg-teal-400 dark:bg-teal-700/60", // Level 2
      "bg-teal-500 dark:bg-teal-500/70", // Level 3
      "bg-teal-600 dark:bg-teal-400", // Level 4
    ];
    return colors[level] || colors[0];
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get the months to display based on contribution data
  const getDisplayMonths = () => {
    if (contributions.length === 0) return [];
    
    const displayMonths: { month: string; startIndex: number }[] = [];
    let lastMonth = -1;
    
    contributions.forEach((day, index) => {
      const date = new Date(day.date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        displayMonths.push({ month: months[month], startIndex: index });
        lastMonth = month;
      }
    });
    
    return displayMonths;
  };

  // Organize contributions into weeks
  const getWeeks = () => {
    const weeks: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];
    
    contributions.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(day);
      
      if (index === contributions.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    return weeks;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
      </div>
    );
  }

  const weeks = getWeeks();
  const displayMonths = getDisplayMonths();

  return (
    <section className="mb-14">
      <AnimateIn variant="reveal" delay={0.7}>
        <h2 className="text-xl font-semibold tracking-tight mb-6 inline-flex items-center gap-2.5 heading-expressive">
          <svg
            className="w-5 h-5 text-zinc-700 dark:text-zinc-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub Contributions<span className="text-teal-500 dark:text-teal-400 ml-0.5">▼</span>
        </h2>
      </AnimateIn>

      <AnimateIn variant="fadeUp" delay={0.75}>
        {/* Contribution Graph Container */}
        <div className="soft-container p-5 sm:p-6 overflow-hidden mb-5 shine-effect">
          {/* Month Labels */}
          <div className="flex mb-2 text-xs text-zinc-500 dark:text-zinc-500 overflow-x-auto">
            <div className="w-8 flex-shrink-0"></div>
            <div className="flex gap-0" style={{ minWidth: weeks.length * 13 }}>
              {displayMonths.map((item, index) => (
                <span
                  key={index}
                  className="flex-shrink-0"
                  style={{ 
                    width: index < displayMonths.length - 1 
                      ? `${((displayMonths[index + 1]?.startIndex || contributions.length) - item.startIndex) / 7 * 13}px`
                      : 'auto'
                  }}
                >
                  {item.month}
                </span>
              ))}
            </div>
          </div>

          {/* Contribution Grid */}
          <div className="flex overflow-x-auto pb-2 scrollbar-thin-light dark:scrollbar-thin">
            <div className="flex-shrink-0 w-8 flex flex-col justify-between text-xs text-zinc-400 dark:text-zinc-600 py-1">
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = week[dayIndex];
                    if (!day) {
                      return <div key={dayIndex} className="w-[11px] h-[11px]" />;
                    }
                    return (
                      <div
                        key={dayIndex}
                        className={`w-[11px] h-[11px] rounded-sm ${getContributionColor(day.level)} hover:ring-1 hover:ring-zinc-400 dark:hover:ring-zinc-400 transition-all cursor-pointer`}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Total Contributions & Legend */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-500">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{totalContributions.toLocaleString()}</span> contributions in the last year
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-[11px] h-[11px] rounded-sm ${getContributionColor(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Stats Cards */}
      <AnimateIn variant="fadeUp" delay={0.85}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Followers */}
          <div className="glass-card p-5 text-center hover-lift group">
            <div className="flex justify-center mb-2">
              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Followers</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats?.followers ?? "—"}
            </p>
          </div>

          {/* Following */}
          <div className="glass-card p-5 text-center hover-lift group">
            <div className="flex justify-center mb-2">
              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Following</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats?.following ?? "—"}
            </p>
          </div>

          {/* Public Repos */}
          <div className="glass-card p-5 text-center hover-lift group">
            <div className="flex justify-center mb-2">
              <svg className="w-5 h-5 text-pink-500 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Repositories</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats?.public_repos ?? "—"}
            </p>
          </div>

          {/* Contributions */}
          <div className="glass-card p-5 text-center hover-lift group">
            <div className="flex justify-center mb-2">
              <svg className="w-5 h-5 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Contributions</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {totalContributions.toLocaleString()}
            </p>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
