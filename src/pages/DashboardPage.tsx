import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Users,
  Rocket,
  MessageCircle,
  ListChecks,
  CalendarDays,
  CheckCircle2,
  Circle,
  Gift,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { cn } from '../lib/utils';
import { ThemeToggle } from '../components/ThemeToggle';

const EASE = [0.16, 1, 0.3, 1] as const;

const WHATSAPP_URL = 'https://chat.whatsapp.com/LSru1BgvifpEB4OMZsaZEi';

const user = {
  name: 'Wahab',
  email: 'ilahiwahab@gmail.com',
  initials: 'I',
};

const TARGET_DATE = new Date('2026-08-09T20:00:00+05:30');

const TEAM = {
  name: 'NEXORA',
  total: 3,
  members: [
    { name: 'Ratan Kumar', role: 'Leader', affiliation: 'ABES Engineering College', initials: 'RK' },
    { name: 'Rashi Pathak', role: 'Member', affiliation: 'ABES Engineering College', initials: 'RP' },
    { name: 'Wahab Ilahi', role: 'Member', affiliation: '', initials: 'WI' },
  ],
};

const CHECKLIST = [
  {
    title: 'Public GitHub repo',
    desc: 'Your full project source, public and cloneable. Private repos won\'t be judged.',
    status: 'done' as const,
  },
  {
    title: 'Live deployed URL',
    desc: 'Something we can open — Vercel, Netlify, or any reachable host. A README-only demo doesn\'t count.',
    status: 'pending' as const,
  },
  {
    title: 'AI-usage log',
    desc: 'A PROMPTS.md in the repo, or exported chat transcripts. This is how we verify the build was genuinely vibe-coded.',
    status: 'pending' as const,
  },
];

type DayState = 'done' | 'missed' | 'today' | 'upcoming';

const streakDays: { label: string; state: DayState }[] = [
  { label: 'D6', state: 'done' },
  { label: 'D7', state: 'done' },
  { label: 'D8', state: 'done' },
  { label: 'D9', state: 'missed' },
  { label: 'D10', state: 'done' },
  { label: 'D11', state: 'done' },
  { label: 'D12', state: 'today' },
];

const STREAK_COUNT = 2;

const TIMELINE = [
  {
    title: 'Registrations Open',
    date: 'Aug 1, 2026',
    copy: 'Form teams, claim sponsor perks, and choose your track.',
    icon: Rocket,
  },
  {
    title: 'Problem Statements Release',
    date: 'Aug 8, 2026',
    copy: 'Live challenge briefings and team sync-up.',
    icon: CalendarDays,
  },
  {
    title: 'Hackathon Submission Deadline',
    date: 'Aug 9, 2026',
    copy: 'Final code freeze & project evaluation.',
    icon: CheckCircle2,
  },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
    done: diff === 0,
  };
}

function ModuleHeader({
  icon: Icon,
  title,
  right,
}: {
  icon: typeof Flame;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-base font-bold text-foreground">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border border-border bg-card/80 py-1 pl-1 pr-2 transition-colors hover:border-primary/50"
          aria-label="Open profile menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-600 text-xs font-bold text-white">
            {user.initials}
          </span>
          <span className="max-w-[90px] truncate text-xs font-semibold text-foreground sm:max-w-none">
            {user.name || 'Builder'}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 p-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-600 text-xs font-bold text-white">
            {user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{user.name || 'ABTalks builder'}</p>
            {user.email ? (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            ) : (
              <p className="text-xs font-medium text-amber-500">Complete your profile</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Dashboard</DropdownMenuItem>
        <DropdownMenuItem>Profile &amp; settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-500 focus:text-rose-500">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/abtalks.ico"
            alt="ABTalks logo"
            className="h-8 w-8 shrink-0 object-contain"
          />
          <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
            AB<span className="text-primary">Talks</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

function WelcomeSection() {
  return (
    <section className="pt-8 sm:pt-10">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Welcome, {user.name || 'builder'}
        </h1>
        <Badge
          variant="outline"
          className="rounded-full border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary"
        >
          {TEAM.name}
        </Badge>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        ABTalks Vibe Code Hackathon · 48 hours · teams of 1–3
      </p>
    </section>
  );
}

function CountdownCard() {
  const { days, hours, minutes, seconds, done } = useCountdown(TARGET_DATE);

  const groups = [
    { value: days, label: 'DAYS' },
    { value: hours, label: 'HRS' },
    { value: minutes, label: 'MIN' },
    { value: seconds, label: 'SEC' },
  ];

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-primary/30 p-5 sm:p-7 shadow-lg"
      style={{
        background:
          'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.15) 50%, rgba(219,39,119,0.1) 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" aria-hidden="true" />
      <div className="relative">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-primary">
          Time left to submit
        </p>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          Sunday, 9 Aug · 8:00 PM IST
        </p>

        {done ? (
          <p className="mt-6 text-center font-heading text-lg font-bold text-foreground">
            Time's up — submissions closed.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
            {groups.map((g) => {
              const str = String(g.value).padStart(2, '0');
              return (
                <div
                  key={g.label}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/80 px-1 pb-2 pt-3 text-center shadow-sm backdrop-blur-md"
                >
                  <div
                    className="font-digital text-2xl leading-none text-primary sm:text-4xl"
                    role="timer"
                    aria-live="polite"
                  >
                    {str}
                  </div>
                  <p className="mt-3 text-[9px] font-semibold tracking-[0.2em] text-muted-foreground sm:text-[10px]">
                    {g.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const dayDotStyles: Record<DayState, string> = {
  done: 'bg-primary text-white border-primary',
  missed: 'bg-rose-500/20 text-rose-500 border-rose-500/40',
  today: 'bg-primary/15 text-primary border-primary ring-2 ring-primary/30',
  upcoming: 'bg-secondary text-muted-foreground border-border',
};

function StreakStrip() {
  return (
    <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
      {streakDays.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 350, damping: 20 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold cursor-pointer transition-colors sm:h-10 sm:w-10',
              dayDotStyles[d.state]
            )}
            title={
              d.state === 'missed'
                ? 'Missed day'
                : d.state === 'today'
                ? 'Today'
                : d.state === 'done'
                ? 'Completed'
                : 'Upcoming'
            }
          >
            {d.state === 'done' ? '✓' : d.state === 'missed' ? '✕' : d.state === 'today' ? '•' : ''}
          </motion.span>
          <span
            className={cn(
              'text-[10px] font-semibold tracking-tight',
              d.state === 'today' ? 'text-primary font-bold' : 'text-muted-foreground'
            )}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function StreakCard() {
  const zero = STREAK_COUNT === 0;
  return (
    <section className="glass-card relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(115,100,230,0.18),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative">
        <ModuleHeader
          icon={Flame}
          title="Your streak"
          right={
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-500">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              {STREAK_COUNT} {STREAK_COUNT === 1 ? 'day' : 'days'}
            </span>
          }
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {zero
            ? 'No streak yet — start today and make it Day 1. Small wins compound.'
            : 'Keep it going. One focused session today keeps the streak alive.'}
        </p>
        <StreakStrip />
      </div>
    </section>
  );
}

function ProgressRing({ value }: { value: number }) {
  const size = 92;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          className="stroke-border"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          fill="none"
          className="text-primary"
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-digital text-xl leading-none text-foreground">
          {Math.round(value * 100)}%
        </span>
        <span className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">ready</span>
      </div>
    </div>
  );
}

function ProgressCard() {
  const done = CHECKLIST.filter((c) => c.status === 'done').length;
  const value = done / CHECKLIST.length;

  return (
    <section className="glass-card p-5">
      <ModuleHeader icon={CheckCircle2} title="Challenge progress" />
      <div className="mt-4 flex items-center gap-4">
        <ProgressRing value={value} />
        <div className="min-w-0">
          <p className="font-heading text-lg font-bold text-foreground">
            {done} of {CHECKLIST.length} items
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Submission items checked off. Lock these in before the deadline.
          </p>
        </div>
      </div>
    </section>
  );
}

function SponsorCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:p-7 shadow-sm">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-elevation-2">
            <Gift className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">Your Breeth Pro access</h2>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Partner unlock
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          Breeth is a memory layer for AI agents — persistent memory for whatever you build,
          plus an MCP server your AI assistant can use while it codes. Every participant gets
          Pro, free.
        </p>

        <p className="mt-3 inline-flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <span className="mt-0.5 text-primary">•</span>
          Claim it and run one test write before kickoff. Setup time is not build time.
        </p>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-elevation-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-3"
          >
            Claim your Breeth Pro access
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Quickstart and MCP setup
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ChallengeCard() {
  return (
    <section className="glass-card p-5 sm:p-6">
      <ModuleHeader icon={Rocket} title="Your challenge" />
      <p className="mt-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Three Problem Statements are now available.</span>{' '}
        Read each one, then pick your direction.
      </p>
      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Submission prep</span>
            <span className="text-foreground/80 font-medium">1 of 3</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary to-indigo-600" />
          </div>
        </div>
        <Link
          to="/challenges"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-2"
        >
          Check Problem Statements
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function RosterCard() {
  const { members } = TEAM;
  return (
    <section className="glass-card p-5">
      <ModuleHeader
        icon={Users}
        title="Team roster"
        right={
          <span className="rounded-lg border border-border bg-secondary px-2.5 py-1 font-mono text-xs font-bold text-foreground">
            {TEAM.name} · {members.length}/{TEAM.total}
          </span>
        }
      />
      {members.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border bg-secondary/50 p-5 text-center text-sm text-muted-foreground">
          No teammates yet. Share your invite link to grow your team.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border/60">
          {members.map((m) => (
            <li key={m.name} className="flex items-center gap-3.5 py-3 first:pt-1 last:pb-1">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-600 text-xs font-bold text-white">
                {m.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                  <span
                    className={cn(
                      'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                      m.role === 'Leader'
                        ? 'bg-primary/15 text-primary'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {m.role}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{m.affiliation}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ChecklistCard() {
  const done = CHECKLIST.filter((c) => c.status === 'done').length;

  return (
    <section className="glass-card p-5">
      <ModuleHeader icon={ListChecks} title="Submission checklist" />
      <div className="mt-3 flex items-center gap-2.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${(done / CHECKLIST.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {done}/{CHECKLIST.length} done
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {CHECKLIST.map((item) => {
          const isDone = item.status === 'done';
          return (
            <li
              key={item.title}
              className={cn(
                'flex gap-3 rounded-2xl border p-3.5 transition-colors',
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/[0.08]'
                  : 'border-border bg-card'
              )}
            >
              {isDone ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <span
                    className={cn(
                      'rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                      isDone ? 'bg-emerald-500/15 text-emerald-500' : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {isDone ? 'Done' : 'Pending'}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        Submit these on the submission page
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}

function TimelineCard() {
  return (
    <section className="glass-card p-5 sm:p-6">
      <ModuleHeader icon={CalendarDays} title="Event info" />

      <ol className="mt-5 space-y-0">
        {TIMELINE.map((step, i) => {
          const isLast = i === TIMELINE.length - 1;
          return (
            <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className="absolute left-[19px] top-11 h-[calc(100%-2.5rem)] w-px bg-border"
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-sm font-bold text-foreground">{step.title}</h3>
                  <span className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {step.date}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.copy}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-500 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-500/15"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Join the WhatsApp group
      </a>
    </section>
  );
}

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <WelcomeSection />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-6 space-y-6"
        >
          <CountdownCard />
          <div className="grid gap-6 sm:grid-cols-2">
            <StreakCard />
            <ProgressCard />
          </div>
          <SponsorCard />
          <ChallengeCard />
          <div className="grid gap-6 sm:grid-cols-2">
            <RosterCard />
            <ChecklistCard />
          </div>
          <TimelineCard />
        </motion.div>
      </main>
    </div>
  );
}