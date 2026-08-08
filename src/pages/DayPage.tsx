import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarX,
  Check,
  ChevronDown,
  CircleAlert,
  Clock,
  ExternalLink,
  Flame,
  Hourglass,
  Lightbulb,
  ListChecks,
  Loader2,
  PenLine,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const DAY = {
  number: 12,
  total: 60,
  track: 'AI Engineering',
  title: 'Build a tiny RAG search over your own notes',
  brief: [
    "By now you've wired up prompts and shipped an API or two. Today we go one level deeper: build a small retrieval pipeline over your own notes — the study notes, lecture PDFs, or interview prep you actually have lying around.",
    'Split them into chunks, index them, and expose two endpoints: one that retrieves the top relevant chunks, and one that answers a question using only those chunks.',
    'No vector database required — a clean, well-scored retriever is the whole point, and it should hold up when someone reads your code.',
  ].join(' '),
  why:
    'RAG is the single most-cited skill in current AI job posts, and a working example over your own data is a story you can tell in any interview — it proves you understand grounding, retrieval, and when a model should admit it doesn’t know.',
  estimate: '60\u201390 min',
  difficulty: 'Medium',
  criteria: [
    'Index at least 10 of your own notes or documents — every chunk stores its source title plus a page or line reference.',
    'GET /search?q=… returns the top 5 chunks ranked by relevance, each with a numeric score and its source reference.',
    'POST /ask answers strictly from the retrieved chunks and returns {"answer": "I don’t have that in my notes."} when the top score sits below a threshold you document.',
    'Empty or malformed input returns a readable 400 — no unhandled exceptions, no 500s.',
    'A short README (or a top-of-file comment) that names your chunk store, your scorer, and the exact command to run it.',
  ],
  hints: [
    'Start with Markdown notes — no scraping. Split on headings and paragraphs, and keep a title + chunk index attached to every chunk.',
    'Your scorer can be simple: count how many query terms appear in the chunk, weight by term frequency, and divide by length. Perfect is the enemy of done.',
    'For the "I don’t know" threshold, run five queries that are definitely absent from your notes and take the highest score you see — that’s your line.',
  ],
};

const STORAGE_KEY = 'abtalks.day12.submission';

interface Submission {
  github: string;
  linkedin: string;
  submittedAt: string;
}

function loadSubmission(): Submission | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Submission;
    return parsed && parsed.github && parsed.linkedin ? parsed : null;
  } catch {
    return null;
  }
}

function saveSubmission(submission: Submission) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
  } catch {
    // Sandboxed contexts may block localStorage; the in-memory state still works.
  }
}

const GITHUB_RE =
  /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9]([A-Za-z0-9._-]*[A-Za-z0-9])?\/[A-Za-z0-9_.-]+(?:\/(commit|blob|tree|releases\/tag)\/[A-Za-z0-9._@/-]+)?\/?$/i;

const LINKEDIN_RE =
  /^https?:\/\/([a-z0-9-]+\.)*linkedin\.com\/(posts\/[\w-]+|feed\/update\/[\w:-]+|embed\/feed\/update\/[\w:-]+)([?#].*)?$/i;

type View = 'active' | 'submitted' | 'missed';
type Phase = 'form' | 'submitting' | 'success';
type Mode = 'create' | 'edit' | 'practice';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.3-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.52-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.77.11 3.06.73.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12v3.15c0 .31.21.66.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  meta,
}: {
  icon: typeof Flame;
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-base font-bold text-white">{title}</h2>
      </div>
      {meta && (
        <span className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-400">
          {meta}
        </span>
      )}
    </div>
  );
}

type FieldStatus = 'idle' | 'valid' | 'error';

interface UrlFieldProps {
  id: string;
  label: string;
  placeholder: string;
  icon: ReactNode;
  value: string;
  status: FieldStatus;
  hint: string;
  error: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

function UrlField({
  id,
  label,
  placeholder,
  icon,
  value,
  status,
  hint,
  error,
  onChange,
  onBlur,
}: UrlFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-zinc-400">
        {label}
      </label>
      <div
        className={cn(
          'mt-1.5 flex items-center gap-2.5 rounded-xl border bg-zinc-900/60 px-3.5 transition-colors duration-200',
          status === 'valid'
            ? 'border-emerald-500/50 ring-2 ring-emerald-500/15'
            : status === 'error'
            ? 'border-rose-500/50 ring-2 ring-rose-500/15'
            : 'border-zinc-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
        )}
      >
        <span
          className={cn(
            'shrink-0 transition-colors duration-200',
            status === 'valid'
              ? 'text-emerald-400'
              : status === 'error'
              ? 'text-rose-400'
              : 'text-zinc-500'
          )}
        >
          {icon}
        </span>
        <input
          id={id}
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full bg-transparent py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
        />
        <AnimatePresence initial={false}>
          {status === 'valid' && (
            <motion.span
              key="valid"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="shrink-0 text-emerald-400"
            >
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          )}
          {status === 'error' && (
            <motion.span
              key="error"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="shrink-0 text-rose-400"
            >
              <CircleAlert className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
        {status === 'error' && (
          <motion.p
            key="err"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mt-1.5 overflow-hidden text-xs text-rose-400"
          >
            {error}
          </motion.p>
        )}
        {status === 'valid' && (
          <motion.p
            key="ok"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mt-1.5 overflow-hidden text-xs text-emerald-400/90"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const CONFETTI_COLORS = ['#7364E6', '#C4B5FD', '#22D3EE', '#34D399', '#F59E0B', '#F472B6'];

function Confetti({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  const parts = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const dist = 90 + (i % 5) * 22;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist + 60,
      rotate: (i * 37) % 360,
      delay: i * 0.02,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-2 w-1.5 rounded-sm"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: [1, 1, 0], rotate: p.rotate, scale: [1, 0.8, 0.5] }}
          transition={{ duration: 1.1, delay: 0.35 + p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function SuccessBadge({ reduced }: { reduced: boolean }) {
  const draw = !reduced;
  return (
    <div className="relative">
      <motion.span
        className="absolute -inset-6 rounded-full bg-emerald-500/20 blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        aria-hidden="true"
      />
      <motion.svg viewBox="0 0 100 100" className="relative h-24 w-24" aria-hidden="true">
        <defs>
          <linearGradient id="day12-check-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="url(#day12-check-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: draw ? 0.5 : 0, ease: 'easeOut' }}
        />
        <motion.path
          d="M 32 52 L 45 64 L 68 38"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: draw ? 0.35 : 0, delay: draw ? 0.45 : 0 }}
        />
      </motion.svg>
    </div>
  );
}

function SuccessOverlay({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Confetti reduced={!!reduced} />
      <motion.div
        className="relative flex flex-col items-center text-center"
        initial={{ scale: 0.8, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.05 }}
      >
        <SuccessBadge reduced={!!reduced} />
        <h3 className="mt-6 font-heading text-xl font-extrabold text-white">
          {mode === 'practice' ? 'Day 12 practiced' : 'Day 12 submitted'}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
          {mode === 'practice'
            ? 'Good on you. This one won’t count toward your streak — but the reps matter.'
            : 'Both links are locked in. Your streak lives another day.'}
        </p>
      </motion.div>
    </motion.div>
  );
}

interface SubmissionFormProps {
  mode: Mode;
  phase: Phase;
  github: string;
  linkedin: string;
  githubStatus: FieldStatus;
  linkedinStatus: FieldStatus;
  githubError: string;
  linkedinError: string;
  onGithubChange: (value: string) => void;
  onLinkedinChange: (value: string) => void;
  onGithubBlur: () => void;
  onLinkedinBlur: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function SubmissionForm({
  mode,
  phase,
  github,
  linkedin,
  githubStatus,
  linkedinStatus,
  githubError,
  linkedinError,
  onGithubChange,
  onLinkedinChange,
  onGithubBlur,
  onLinkedinBlur,
  onSubmit,
}: SubmissionFormProps) {
  const canSubmit = phase === 'form' && githubStatus === 'valid' && linkedinStatus === 'valid';
  const buttonLabel =
    mode === 'edit' ? 'Update submission' : mode === 'practice' ? 'Save practice submission' : 'Submit Day 12';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {mode === 'practice' && (
        <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-amber-400/90">
          Practice mode — this won’t count toward your streak. The form works exactly as it
          would on a live day.
        </p>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
        <UrlField
          id="day12-github"
          label="GitHub repo or commit URL"
          placeholder="https://github.com/you/day-12-rag"
          icon={<GithubIcon className="h-4 w-4" />}
          value={github}
          status={githubStatus}
          hint="That’s a valid GitHub link."
          error={githubError}
          onChange={onGithubChange}
          onBlur={onGithubBlur}
        />
        <UrlField
          id="day12-linkedin"
          label="LinkedIn post URL"
          placeholder="https://www.linkedin.com/posts/…"
          icon={<LinkedinIcon className="h-4 w-4" />}
          value={linkedin}
          status={linkedinStatus}
          hint="That’s a valid LinkedIn post link."
          error={linkedinError}
          onChange={onLinkedinChange}
          onBlur={onLinkedinBlur}
        />

        <div className="pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'relative w-full overflow-hidden rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 ease-out',
              canSubmit
                ? 'bg-gradient-to-r from-primary to-indigo-500 text-white shadow-elevation-2 hover:-translate-y-0.5 hover:shadow-elevation-3'
                : 'cursor-not-allowed bg-zinc-800 text-zinc-500'
            )}
          >
            {phase === 'submitting' ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Locking in your day…
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                {buttonLabel}
                <Send className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-zinc-500">
            Both links must be valid before you can submit.
          </p>
        </div>
      </form>
    </motion.div>
  );
}

function LinkRow({ icon, label, url }: { icon: ReactNode; label: string; url: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-sm font-medium text-[#C4B5FD] transition-colors hover:text-white"
        >
          {url}
        </a>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />
    </div>
  );
}

function formatSubmittedAt(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return 'earlier today';
  }
}

function SubmittedCard({
  submission,
  onEdit,
}: {
  submission: Submission;
  onEdit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
          <BadgeCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-white">Day 12 submitted</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            Submitted {formatSubmittedAt(submission.submittedAt)} · streak kept
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <LinkRow icon={<GithubIcon className="h-4 w-4" />} label="GitHub" url={submission.github} />
        <LinkRow
          icon={<LinkedinIcon className="h-4 w-4" />}
          label="LinkedIn"
          url={submission.linkedin}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <button
          onClick={onEdit}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-zinc-600"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
          Edit submission
        </button>
        <Link
          to="/dashboard"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-elevation-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-3"
        >
          Back to dashboard
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}

function MissedCard({
  practiced,
  onPractice,
}: {
  practiced: boolean;
  onPractice: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
          <CalendarX className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-white">This day is past due</h3>
          <p className="mt-0.5 text-xs text-zinc-500">No submission · won’t count toward your streak</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-400">
        The window for Day 12 closed without a submission. That’s fine — it happens. The skill
        still matters, so the task stays open if you want to build it anyway; it just won’t be
        counted toward your streak.
      </p>

      {practiced && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-3.5 py-2.5 text-xs font-medium text-emerald-400">
          <Check className="h-4 w-4" aria-hidden="true" />
          You practiced this day on your own. Reps count, streaks don’t.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <button
          onClick={onPractice}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-elevation-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-3"
        >
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
          {practiced ? 'Practice it again' : 'Practice it on my own'}
        </button>
        <Link
          to="/dashboard"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-3 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          Back to dashboard
        </Link>
      </div>
    </motion.div>
  );
}

const VIEWS: { value: View; label: string }[] = [
  { value: 'active', label: 'Active task' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'missed', label: 'Missed' },
];

function DevPanel({
  view,
  onSwitch,
  onReset,
}: {
  view: View;
  onSwitch: (v: View) => void;
  onReset: () => void;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-zinc-800 p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          Dev · preview this day’s state
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          reset
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.value}
            onClick={() => onSwitch(v.value)}
            className={cn(
              'rounded-lg border px-3 py-2 font-mono text-xs transition-colors',
              view === v.value
                ? 'border-primary bg-primary/10 text-[#C4B5FD]'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DayPage() {
  const [submission, setSubmission] = useState<Submission | null>(() => loadSubmission());
  const [view, setView] = useState<View>(() => (loadSubmission() ? 'submitted' : 'active'));
  const [mode, setMode] = useState<Mode>(() => (loadSubmission() ? 'edit' : 'create'));
  const [phase, setPhase] = useState<Phase>('form');
  const [practiced, setPracticed] = useState(false);

  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [githubBlurred, setGithubBlurred] = useState(false);
  const [linkedinBlurred, setLinkedinBlurred] = useState(false);

  const [hintsOpen, setHintsOpen] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState<Set<number>>(new Set());

  const githubOk = GITHUB_RE.test(github.trim());
  const linkedinOk = LINKEDIN_RE.test(linkedin.trim());
  const githubStatus: FieldStatus = !github
    ? 'idle'
    : githubOk
    ? 'valid'
    : githubBlurred
    ? 'error'
    : 'idle';
  const linkedinStatus: FieldStatus = !linkedin
    ? 'idle'
    : linkedinOk
    ? 'valid'
    : linkedinBlurred
    ? 'error'
    : 'idle';

  function toggleCriteria(i: number) {
    setCheckedCriteria((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!githubOk || !linkedinOk || phase !== 'form') return;
    setPhase('submitting');
    window.setTimeout(() => {
      const record: Submission = {
        github: github.trim(),
        linkedin: linkedin.trim(),
        submittedAt: new Date().toISOString(),
      };
      setSubmission(record);
      if (mode !== 'practice') saveSubmission(record);
      setPhase('success');
      window.setTimeout(() => {
        setPhase('form');
        if (mode === 'practice') {
          setPracticed(true);
          setView('missed');
        } else {
          setMode('edit');
          setView('submitted');
        }
      }, 2800);
    }, 1300);
  }

  function openEdit() {
    if (submission) {
      setGithub(submission.github);
      setLinkedin(submission.linkedin);
    }
    setGithubBlurred(false);
    setLinkedinBlurred(false);
    setMode('edit');
    setPhase('form');
    setView('active');
  }

  function openPractice() {
    setGithubBlurred(false);
    setLinkedinBlurred(false);
    setMode('practice');
    setPhase('form');
    setView('active');
  }

  function switchView(v: View) {
    setPhase('form');
    if (v === 'active') {
      if (submission) {
        setGithub(submission.github);
        setLinkedin(submission.linkedin);
        setMode('edit');
      } else {
        setMode('create');
      }
      setGithubBlurred(false);
      setLinkedinBlurred(false);
    }
    setView(v);
  }

  function resetDemo() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSubmission(null);
    setPracticed(false);
    setGithub('');
    setLinkedin('');
    setGithubBlurred(false);
    setLinkedinBlurred(false);
    setMode('create');
    setPhase('form');
    setView('active');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/abtalks.ico"
              alt="ABTalks logo"
              className="h-8 w-8 shrink-0 object-contain"
            />
            <span className="font-heading text-lg font-extrabold tracking-tight text-white">
              AB<span className="text-primary">Talks</span>
            </span>
          </Link>
          <span className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-xs text-zinc-400">
            {DAY.number}/{DAY.total}
          </span>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <section className="pt-7 sm:pt-10">
            <div className="flex items-center gap-2 font-digital text-sm text-[#C4B5FD]">
              <Flame className="h-4 w-4 text-amber-400" aria-hidden="true" />
              Day {DAY.number}
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-500">{DAY.total}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#C4B5FD]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {DAY.track}
              </Badge>
              <Badge className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-400">
                {DAY.difficulty}
              </Badge>
              <Badge className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {DAY.estimate}
              </Badge>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {DAY.title}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base"
            >
              {DAY.brief}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.08, ease: EASE }}
              className="mt-5 flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4"
            >
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C4B5FD]" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                <span className="font-semibold text-[#C4B5FD]">Why this matters: </span>
                {DAY.why}
              </p>
            </motion.div>
          </section>

          <section className="mt-10">
            <SectionHeading
              icon={ListChecks}
              title="What’s expected today"
              meta={`${checkedCriteria.size} of ${DAY.criteria.length}`}
            />
            <div className="mt-4 space-y-2.5">
              {DAY.criteria.map((c, i) => {
                const done = checkedCriteria.has(i);
                return (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => toggleCriteria(i)}
                    aria-pressed={done}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
                    className={cn(
                      'flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-colors duration-200',
                      done
                        ? 'border-primary/30 bg-primary/[0.05]'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-200',
                        done
                          ? 'border-primary bg-gradient-to-br from-primary to-fuchsia-500'
                          : 'border-zinc-700 bg-zinc-900'
                      )}
                    >
                      <AnimatePresence>
                        {done && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          >
                            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} aria-hidden="true" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span
                      className={cn(
                        'text-sm leading-relaxed transition-colors duration-200',
                        done ? 'text-zinc-400' : 'text-zinc-300'
                      )}
                    >
                      {c}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="mt-6">
            <button
              onClick={() => setHintsOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-left transition-colors hover:border-zinc-700"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-zinc-300">
                <Lightbulb className="h-4 w-4 text-amber-400" aria-hidden="true" />
                Stuck? Open a hint
              </span>
              <motion.span
                animate={{ rotate: hintsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-zinc-500"
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {hintsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
                    {DAY.hints.map((h, i) => (
                      <p key={i} className="flex gap-2.5 text-xs leading-relaxed text-zinc-400">
                        <span className="font-mono text-zinc-600">{i + 1}.</span>
                        {h}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section className="mt-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-7"
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <SectionHeading icon={Send} title="Submit today’s work" />
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Paste the links to your work below. Both are required before you can lock in the
                  day.
                </p>

                <AnimatePresence mode="wait" initial={false}>
                  {view === 'active' && (
                    <SubmissionForm
                      key="form"
                      mode={mode}
                      phase={phase}
                      github={github}
                      linkedin={linkedin}
                      githubStatus={githubStatus}
                      linkedinStatus={linkedinStatus}
                      githubError={
                        'That doesn’t look like a GitHub repo or commit link — e.g. github.com/you/repo or github.com/you/repo/commit/abc123'
                      }
                      linkedinError={
                        'That doesn’t look like a LinkedIn post link — it should be a linkedin.com/posts/ or /feed/update/ URL'
                      }
                      onGithubChange={setGithub}
                      onLinkedinChange={setLinkedin}
                      onGithubBlur={() => setGithubBlurred(true)}
                      onLinkedinBlur={() => setLinkedinBlurred(true)}
                      onSubmit={handleSubmit}
                    />
                  )}
                  {view === 'submitted' && submission && (
                    <div key="submitted" className="mt-5">
                      <SubmittedCard submission={submission} onEdit={openEdit} />
                    </div>
                  )}
                  {view === 'missed' && (
                    <div key="missed" className="mt-5">
                      <MissedCard practiced={practiced} onPractice={openPractice} />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>

          <DevPanel view={view} onSwitch={switchView} onReset={resetDemo} />
        </div>
      </main>

      <AnimatePresence>
        {phase === 'success' && <SuccessOverlay key="success" mode={mode} />}
      </AnimatePresence>
    </div>
  );
}
