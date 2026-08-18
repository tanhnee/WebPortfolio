"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Download, ArrowRight, Github, Linkedin, Mail, ChevronDown, Brain, BarChart3, Code2, Trophy } from "lucide-react";
interface Profile { id: string; name: string; title?: string | null; bio?: string | null; summary?: string | null; email: string; phone?: string | null; location?: string | null; linkedinUrl?: string | null; githubUrl?: string | null; cvUrl?: string | null; avatarUrl?: string | null; }

interface HeroSectionProps {
  profile: Profile | null;
  education: { gpa?: string | null; school?: string }[];
  researchCount: number;
  projectCount: number;
  awardCount: number;
}

function TypingEffect({ titles }: { titles: string[] }) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!titles.length) return;
    const current = titles[titleIndex % titles.length];
    if (!isDeleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setTitleIndex((i) => (i + 1) % titles.length);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isDeleting, titleIndex, titles]);

  return (
    <span className="text-primary">
      {displayed}
      <span className="border-r-2 border-primary ml-0.5 animate-blink" />
    </span>
  );
}

export function HeroSection({ profile, education, researchCount, projectCount, awardCount }: HeroSectionProps) {
  const linkedinUrl = profile?.linkedinUrl || "#";
  const githubUrl = profile?.githubUrl || "#";
  const email = profile?.email || "";
  const cvUrl = profile?.cvUrl || "#";
  const name = profile?.name || "Buu Tanh";
  const [emailCopied, setEmailCopied] = useState(false);
  const copyEmail = useCallback(() => {
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }, [email]);
  const firstName = name.split(" ").pop() || name;
  const edu = education[0];

  // Titles from profile.title split by "|"
  const titles = profile?.title
    ? profile.title.split("|").map((t) => t.trim()).filter(Boolean)
    : ["Business Analyst", "Data Analyst", "AI Solution Builder"];

  const stats = [
    { value: `${projectCount}+`, label: "Projects", icon: Brain },
    { value: `${researchCount}`, label: "Research Papers", icon: BarChart3 },
    { value: `${awardCount}`, label: "Awards", icon: Trophy },
    { value: edu?.gpa || "—", label: "GPA / 10", icon: Code2 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 cyber-grid opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Available for opportunities
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
            >
              Hi, I&apos;m{" "}
              <span className="gradient-text text-glow-cyan">{firstName}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl font-semibold text-foreground/80 mb-6 h-10"
            >
              <TypingEffect titles={titles} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {profile?.summary || (profile?.bio ? profile.bio.split(/[.!?]\s+/)[0] + "." : "Building intelligent systems that create real value.")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
            >
              <Link href="/projects" className="btn-primary flex items-center gap-2">
                View My Projects <ArrowRight size={16} />
              </Link>
              {cvUrl !== "#" && (
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
                  <Download size={16} /> Download CV
                </a>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              {[
                { href: linkedinUrl, icon: Linkedin, label: "LinkedIn", show: !!profile?.linkedinUrl },
                { href: githubUrl, icon: Github, label: "GitHub", show: !!profile?.githubUrl },
              ].filter((s) => s.show).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <social.icon size={18} />
                </a>
              ))}
              {!!email && (
                <div className="relative">
                  <button
                    onClick={copyEmail}
                    aria-label="Copy email"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                  >
                    <Mail size={18} />
                  </button>
                  {emailCopied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-primary text-black px-2 py-1 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-primary/20 via-card to-accent/20 border-2 border-primary/30 shadow-cyan-lg flex items-center justify-center overflow-hidden animate-glow-pulse">
                {profile?.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt={name} fill className="object-cover rounded-full" />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl md:text-7xl mb-2">👤</div>
                    <p className="text-muted-foreground text-sm">{name}</p>
                  </div>
                )}
              </div>
              <div className="absolute -inset-3 rounded-full border border-primary/10 animate-pulse" />
              <div className="absolute -inset-6 rounded-full border border-primary/5" />
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 glass-card px-3 py-2 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent font-medium">Open to Work</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-3 w-full max-w-xs"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="glass-card p-3 text-center card-hover"
                >
                  <div className="text-xl font-bold gradient-text-cyan mb-0.5">{stat.value}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
