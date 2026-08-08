import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FolderGit,
  Briefcase,
  GraduationCap,
  Code,
  Trophy,
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Flame,
  CalendarDays,
  Bot,
  Rocket,
  Sparkles,
  BadgeCheck,
  MessageCircle,
  TrendingUp,
  Star,
} from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { SocialIcon } from '../components/SocialIcons';
import { PerspectiveGrid } from '../components/PerspectiveGrid';
import { TextGenerateEffect } from '../components/TextGenerateEffect';
import { MagneticButton } from '../components/MagneticButton';
import { cn } from '../lib/utils';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

const EASE = [0.16, 1, 0.3, 1] as const;

const tracks = [
  {
    name: '60-Day Coding Challenge',
    status: 'Enrolling now',
    statusTone: 'live',
    duration: '60 days',
    icon: CalendarDays,
    accent: 'violet',
    tags: ['AI', 'Data Science', 'Software Engineering'],
    description:
      'One real task every day across AI, Data Science, or Software Engineering. Build a streak and a public portfolio.',
    cta: 'Start the challenge',
    href: '/challenges',
  },
  {
    name: 'Vibe Code Hackathon',
    status: 'Registration closed',
    statusTone: 'closed',
    duration: '48 hours',
    icon: Rocket,
    accent: 'indigo',
    tags: ['Teams of 1–3'],
    description:
      'Build anything using AI in 48 hours. Compete solo or with a team of up to three and ship something real.',
    cta: 'Explore ABTalks',
    href: 'https://abtalks.in',
  },
  {
    name: '31 Days AI Cohort',
    status: 'Applications open',
    statusTone: 'live',
    duration: '31 days',
    icon: Bot,
    accent: 'indigo',
    tags: ['RAG', 'Agents', 'MCP'],
    description:
      'Build and deploy a production AI chatbot in 31 days. Learn RAG, agents, MCP, and get in front of recruiters.',
    cta: 'Apply now',
    href: '/program',
  },
  {
    name: 'Claude Challenge',
    status: 'New',
    statusTone: 'new',
    duration: '60 days',
    icon: Sparkles,
    accent: 'amber',
    tags: ['AI mastery', 'Prompt engineering'],
    description:
      'Master Claude through focused prompt-engineering tasks and build practical AI workflows.',
    cta: 'Join the Claude track',
    href: '/claude-signup',
  },
];

const accentStyles = {
  violet: {
    tile: 'bg-gradient-to-br from-violet-500 to-violet-600',
    icon: 'text-white',
    chip: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    arrow: 'group-hover:text-violet-400',
  },
  indigo: {
    tile: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    icon: 'text-white',
    chip: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    arrow: 'group-hover:text-indigo-400',
  },
  amber: {
    tile: 'bg-gradient-to-br from-amber-500 to-orange-500',
    icon: 'text-white',
    chip: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    arrow: 'group-hover:text-amber-400',
  },
} as const;

const stats = [
  { icon: Users, value: 10000, suffix: '+', label: 'members' },
  { icon: FolderGit, value: 500, suffix: '+', label: 'projects' },
  { icon: Briefcase, value: 100, suffix: '+', label: 'hiring partners' },
];

const steps = [
  {
    icon: GraduationCap,
    step: '01',
    title: 'Learn Daily',
    copy: 'Choose your track and build practical skills through focused challenges and live sessions.',
  },
  {
    icon: Code,
    step: '02',
    title: 'Build & Showcase',
    copy: 'Ship real work, publish your progress, and turn consistent effort into a visible portfolio.',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Get Hired',
    copy: 'Stand out through proof of work and become discoverable to recruiters in the ABTalks network.',
  },
];

const testimonials = [
  {
    name: 'Samridhi Gupta',
    role: 'Axis Institute of Technology and Management, Kanpur',
    quote:
      'The 60-Day Claude Challenge reshaped how I approach both AI and discipline. I learned prompt engineering from the ground up, but the real transformation was consistency. Sixty days later, I don\'t just write better prompts, I finish what I start.',
  },
  {
    name: 'Vivek',
    role: 'IT Leader · 20+ years of industry experience',
    quote:
      'I wasn\'t looking for another certificate. I was looking for a new way of thinking. With over 20 years in IT leadership, stepping into Generative AI made me feel like a beginner again, and honestly that was the best part. The challenge may have ended, but my AI journey has just begun.',
  },
  {
    name: 'Lakshay',
    role: null,
    quote:
      '60 days ago, I used AI mainly for everyday questions. Today I use it to build complete projects, craft professional resumes, automate workflows, and solve real-world problems. It completely changed the way I think about and use AI.',
  },
  {
    name: 'Rida Khan',
    role: 'AI Enthusiast',
    quote:
      'I joined with curiosity, but also with doubts about whether I could stay consistent for all 60 days. To my surprise, I did it. This wasn\'t just a 60-day challenge. It was a journey that taught me consistency can turn uncertainty into achievement.',
  },
  {
    name: 'Devpal Singh Anand',
    role: null,
    quote:
      'From exploring AI concepts to building production-ready projects, every challenge strengthened my technical skills and encouraged me to think like an engineer. Today AI isn\'t just something I learn. It\'s a tool I use to solve meaningful problems.',
  },
  {
    name: 'Nandika Sharma',
    role: 'IMS Noida',
    quote:
      'More than just creating projects, I learned the art of prompt engineering: how to give clear instructions and solve complex problems step by step. ABTalks didn\'t just teach me AI, it empowered me to build the future with it.',
  },
  {
    name: 'Komal Goswami',
    role: 'MPGI Kanpur',
    quote:
      'Joining the ABTalks 60-Day Claude AI Challenge transformed my AI journey. I mastered prompt engineering, learned to build smarter with AI, and gained the confidence to solve real-world problems.',
  },
  {
    name: 'Yashaswani Singh',
    role: 'AI Enthusiast',
    quote:
      'What started as curiosity about AI soon became a daily habit of learning, building, and improving. More than technical skills, I gained a growth mindset: the confidence to embrace new technologies and keep learning every day.',
  },
  {
    name: 'Divya',
    role: 'Aspiring Software Developer',
    quote:
      'I gained hands-on experience in prompt engineering, AI tools, automation, Git & GitHub, and building real-world AI-powered projects. Every challenge encouraged me to think critically, build with confidence, and continuously improve.',
  },
];

const avatarGradients = [
  'from-violet-500 to-fuchsia-500',
  'from-indigo-500 to-violet-500',
  'from-cyan-500 to-indigo-500',
  'from-fuchsia-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-sky-500 to-blue-500',
  'from-purple-500 to-indigo-500',
  'from-rose-500 to-fuchsia-500',
];

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const socials = [
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/abtalksonai/' },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/abtalks-on-ai/' },
  { name: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@ABTalksOnAI' },
  { name: 'X (Twitter)', icon: 'x', href: 'https://x.com/abtalksonai' },
  { name: 'Discord', icon: 'discord', href: 'https://discord.gg/j4Q8tvDj6' },
] as const;

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div {...fadeUp} transition={{ duration: 0.5, ease: EASE }} className="mb-10 text-center">
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        <TextGenerateEffect words={title} />
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">{subtitle}</p>
      )}
    </motion.div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/abtalks.ico"
            alt="ABTalks logo"
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="font-heading text-xl font-extrabold tracking-tight">
            ABTalks
          </span>
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-2"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" 
  aria-hidden="true"  />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-120px] top-40 h-[300px] w-[300px] rounded-full bg-fuchsia-500/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[-120px] top-80 h-[280px] w-[280px] rounded-full bg-indigo-500/15 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mb-5 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-[var(--shadow-glass)] backdrop-blur-md">
              <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Build in public. Grow together.
            </span>
          </motion.div>

          <h1 className="text-balance font-heading text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            <TextGenerateEffect
              words="Code consistently. Post publicly. Get noticed."
              highlightWords={['Get', 'noticed.']}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground"
          >
            Join India's coding community for college students to learn, build, and
            accelerate their careers through visible proof of work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <MagneticButton className="w-full sm:w-auto">
              <Link
                to="/challenges"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 px-7 py-3.5 text-base font-semibold text-white shadow-elevation-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-3 sm:w-auto"
              >
                Start the challenge
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </MagneticButton>
            <a
              href="https://chat.whatsapp.com/LSru1BgvifpEB4OMZsaZEi"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-7 py-3.5 text-base font-semibold text-foreground backdrop-blur-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-1 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              Join the community
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          className="relative mx-auto mt-14 max-w-md"
        >
          <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-fuchsia-500/20 blur-2xl" aria-hidden="true" />
          <div className="glass-card relative overflow-hidden p-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <p className="text-sm font-semibold">Day 12 of 60</p>
                <p className="text-xs text-muted-foreground">React Hooks · Track 1</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                12-day streak
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Video · useState & useEffect', done: true },
                { label: 'Reading · Rules of Hooks', done: true },
                { label: 'Coding · Build useLocalStorage', done: false },
                { label: 'Challenge · Custom Hook Library', done: false },
              ].map((task) => (
                <div key={task.label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-md border text-[10px] font-bold',
                      task.done
                        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                        : 'border-border bg-card/60 text-muted-foreground'
                    )}
                  >
                    {task.done ? '✓' : '·'}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      task.done ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}
                  >
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-fuchsia-500/10 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">2 of 4 tasks · 50%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              </div>
            </div>
          </div>

          <div className="glass-card absolute -bottom-6 -right-3 hidden items-center gap-2.5 p-3.5 sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold">1,240 XP</p>
              <p className="text-[11px] text-muted-foreground">+120 today</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, ease: EASE }}
        className="glass-card grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-center gap-3.5 px-6 py-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <stat.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function TracksSection() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Programs"
        title="Pick a track, ship every day"
        subtitle="Four ways to build in public — choose the pace that fits your goal."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tracks.map((track, i) => {
          const accent = accentStyles[track.accent];
          return (
            <motion.article
              key={track.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
              className="glass-card group relative flex h-full flex-col p-6"
            >
              <div className="mb-5 flex items-start justify-between">
                <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl shadow-elevation-1', accent.tile)}>
                  <track.icon className={cn('h-6 w-6', accent.icon)} aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                    track.statusTone === 'live' &&
                      'border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
                    track.statusTone === 'closed' &&
                      'border-border bg-card/60 text-muted-foreground',
                    track.statusTone === 'new' &&
                      'border-amber-500/25 bg-amber-500/10 text-amber-400'
                  )}
                >
                  {track.statusTone === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />}
                  {track.statusTone === 'new' && <Sparkles className="h-3 w-3" aria-hidden="true" />}
                  {track.status}
                </span>
              </div>

              <h3 className="font-heading text-lg font-bold leading-snug">{track.name}</h3>

              <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="font-medium">{track.duration}</span>
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {track.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {track.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn('rounded-lg border px-2 py-0.5 text-[11px] font-medium', accent.chip)}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={track.href}
                className={cn(
                  'mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors',
                  accent.arrow
                )}
              >
                {track.cta}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="How ABTalks Works"
          subtitle="A simple loop that compounds: learn a little, build something, get seen."
        />
        <div className="relative grid gap-6 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-10 hidden border-t-2 border-dashed border-border sm:block" aria-hidden="true" />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.12 }}
              className="glass-card relative flex h-full flex-col items-center p-7 text-center"
            >
              <div className="relative mb-5">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-fuchsia-500 text-white shadow-elevation-2">
                  <step.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background font-mono text-[11px] font-bold text-muted-foreground">
                  {step.step}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityBanner() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-6 py-12 text-center shadow-elevation-3 sm:px-12 sm:py-16"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/30 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" aria-hidden="true" />

        <div className="relative">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md">
            <MessageCircle className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mx-auto max-w-lg text-balance text-2xl font-bold text-white sm:text-4xl">
            Join our community for instant updates
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-emerald-50/90">
            Meet builders, get event alerts, and stay accountable.
          </p>
          <MagneticButton className="mt-8 inline-block">
            <a
              href="https://chat.whatsapp.com/LSru1BgvifpEB4OMZsaZEi"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-emerald-800 shadow-elevation-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-3"
            >
              Join now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}

function TestimonialsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our builders say"
          subtitle="Real stories from students and professionals who finished the 60-Day Claude Challenge."
        />
      </div>

      <div
        ref={scrollerRef}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:mx-0 sm:px-0"
      >
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: EASE, delay: i * 0.05 }}
            className="glass-card flex w-[85vw] shrink-0 snap-start flex-col p-6 sm:w-[380px]"
          >
            <Quote className="h-7 w-7 text-primary/40" aria-hidden="true" />
            <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
                  avatarGradients[i % avatarGradients.length]
                )}
                aria-hidden="true"
              >
                {initials(t.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{t.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.role ?? 'ABTalks community member'}
                </p>
              </div>
              <span className="ml-auto flex shrink-0 gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => scrollByCards(-1)}
          aria-label="Previous testimonials"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-1"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => scrollByCards(1)}
          aria-label="Next testimonials"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-1"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/abtalks.ico"
              alt="ABTalks logo"
              className="h-9 w-9 shrink-0 object-contain"
            />
            <span className="font-heading text-xl font-extrabold tracking-tight">
              ABTalks
            </span>
          </Link>

          <p className="max-w-sm text-sm text-muted-foreground">
            Learn, build, and accelerate careers through visible proof of work — for
            India's coding community.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-3">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground backdrop-blur-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-elevation-1"
                >
                  <SocialIcon name={social.icon} className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>

          <div className="w-full border-t border-border/60 pt-6">
            <p className="text-sm text-muted-foreground">
              For any issue or enquiry:{' '}
              <a
                href="mailto:team@abtalks.in"
                className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
              >
                team@abtalks.in
              </a>
            </p>
            <p className="mt-2 text-xs text-muted-foreground/80">
              © {new Date().getFullYear()} ABTalks. Build in public. Grow together.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background/95 text-foreground">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <PerspectiveGrid />
      </div>
      <div className="relative z-10 content-layer">
        <Header />
        <main>
          <Hero />
          <StatsBar />
          <TracksSection />
          <HowItWorks />
          <CommunityBanner />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}