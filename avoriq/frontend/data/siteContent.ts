import { Compass, MessageSquare, ShieldCheck, Users, Zap } from "lucide-react";

export const siteContent = {
  navLinks: [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Scholarships", href: "/scholarships" },
    { name: "About", href: "/about" },
  ],
  hero: {
    tagline: "Your AI Second Brain",
    headingLine1: "AvorIQ Intelligence",
    headingLine2: "Redefined.",
    description: "AvorIQ is your all-in-one AI assistant designed to simplify complex student journeys. From scholarship matching to personalized research, get the answers you need instantly.",
    primaryCta: "Try AvorIQ",
    secondaryCta: "Watch Demo",
  },
  stats: [
    { value: "10k+", label: "Active Users" },
    { value: "99.9%", label: "Accuracy" },
    { value: "24/7", label: "Availability" },
    { value: "Free", label: "For Everyone" },
  ],
  howItWorks: {
    badge: "How it works",
    title: "Simple. Intelligent. Fast.",
    description: "Start chatting with AvorIQ to discover insights, find opportunities, and organize your academic life.",
    steps: [
      {
        num: "01",
        title: "Ask Anything",
        desc: "Type your query about scholarships, career paths, or academic topics in natural language.",
        icon: MessageSquare,
      },
      {
        num: "02",
        title: "AI Analysis",
        desc: "Our engine processes your request against thousands of verified data points and intelligent models.",
        icon: Zap,
      },
      {
        num: "03",
        title: "Get Results",
        desc: "Receive instant, tailored responses and actionable insights to move your goals forward.",
        icon: ShieldCheck,
      },
    ]
  },
  aboutPreview: {
    badge: "Our Mission",
    title: "Democratizing Access to Intelligence and Opportunities.",
    paragraphs: [
      "We believe that every student deserves access to high-quality information and resources, regardless of their location or background.",
      "AvorIQ is more than just a chatbot; it's a personalized intelligence platform that grows with you, helping you navigate the complexities of education and career building."
    ],
    cta: "Read Our Vision",
    highlights: [
      { title: "Intelligence", desc: "Powered by advanced models for deep analysis." },
      { title: "Personalization", desc: "Responses tailored specifically to your profile." },
      { title: "Efficiency", desc: "Save hundreds of hours in manual research." },
      { title: "Global Scale", desc: "Designed for students everywhere around the world." }
    ]
  },
  comingSoon: {
    badge: "Next Steps",
    title: "Expanding the AvorIQ Ecosystem",
    description: "We are constantly evolving to provide more value to our users. Here's what's on the horizon.",
    cta: "View Roadmap",
    modules: [
      {
        title: "Collaborative Chats",
        desc: "Share chats and insights with teammates or mentors in real-time.",
        icon: Users,
      },
      {
        title: "Deep Research Mode",
        desc: "Extended analysis for complex academic and professional projects.",
        icon: Compass,
      },
      {
        title: "Voice Integration",
        desc: "Interact with AvorIQ using natural voice commands for hands-free assistance.",
        icon: Zap,
      },
    ]
  },
  footer: {
    description: "Adaptive Vision for Opportunity and Resources Intelligence Quotient.",
    slogan: "\"Intelligence for all.\"",
    email: "hello@avoriq.ai",
    location: "Global Presence. Built for students everywhere.",
    newsletterTitle: "Stay Updated",
    newsletterDesc: "Get the latest on AI features and educational opportunities delivered to your inbox.",
  }
} as const;
