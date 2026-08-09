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
  Lightbulb,
  ListChecks,
  Loader2,
  PenLine,
  RotateCcw,
  Send,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../lib/utils';
import { PerspectiveGrid } from '../components/PerspectiveGrid';

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
  estimate: '60–90 min',
  difficulty: 'Medium',
  criteria: [
    'Index ≥10 documents with clean chunking and source references',
    'POST /search endpoint returning top-k ranked chunks with scores',
    'POST /ask endpoint returning a grounded answer with cited source chunks',
    'Fall back cleanly (e.g. "I don’t know") when prompt score is below threshold',
    'README with quickstart commands and sample query curls',
  ],
  hints: [
    'Don’t overcomplicate embeddings on Day 12 — cosine similarity over OpenAI `text-embedding-3-small` or BM25 tf-idf works great.',
    'Keep your chunk size around 300–500 tokens with a 50-token overlap so facts aren’t split across boundaries.',
    'System prompt rule: instruct the model to answer using ONLY the context provided, and explicitly tell it to output "I don’t have enough information" if context is empty.',
  ],
};

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  meta,
}: {
  icon: typeof ListChecks;
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-base font-bold text-foreground">{title}</h2>
      </div>
      {meta && (
        <span className="rounded-lg border border-border bg-secondary px-2.5 py-1 font-mono text-xs text-muted-foreground">
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
      <label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {label}
      </label>
      <div
        className={cn(
          'mt-1.5 flex items-center gap-2.5 rounded-xl border bg-card px-3.5 transition-colors duration-200 shadow-sm',
          status === 'valid'
            ? 'border-emerald-500/50 ring-2 ring-emerald-500/15'
            : status === 'error'
            ? 'border-rose-500/50 ring-2 ring-rose-500/15'
            : 'border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
        )}
      >
        <span
          className={cn(
            'shrink-0 transition-colors duration-200',
            status === 'valid'
              ? 'text-emerald-500'
              : status === 'error'
              ? 'text-rose-500'
              : 'text-muted-foreground'
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
          className="w-full bg-transparent py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <AnimatePresence initial={false}>
          {status === 'valid' && (
            <motion.span
              key="valid"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="shrink-0 text-emerald-500"
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
              className="shrink-0 text-rose-500"
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
            className="mt-1.5 overflow-hidden text-xs text-rose-500"
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
            className="mt-1.5 overflow-hidden text-xs text-emerald-500 font-medium"
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
      />
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="relative z-10"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <circle cx="50" cy="50" r="44" fill="#10b981" />
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#34d399"
          strokeWidth="3"
          strokeDasharray="276"
          initial={{ strokeDashoffset: 276 }}
          animate={{ strokeDashoffset: 0 }}
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

type Mode = 'active' | 'edit' | 'practice';
type View = 'active' | 'submitted' | 'missed';
type Phase = 'form' | 'submitting' | 'success';

interface Submission {
  github: string;
  linkedin: string;
  submittedAt: string;
}

const STORAGE_KEY = 'abtalks.day12.submission';

function loadSubmission(): Submission | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Submission;
  } catch {
    return null;
  }
}

function saveSubmission(s: Submission) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // sandbox fallback
  }
}

function clearSubmission() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // sandbox fallback
  }
}

function SuccessOverlay({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm"
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
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-300">
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {mode === 'practice' && (
        <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-amber-500 font-medium">
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
          <motion.button
            type="submit"
            disabled={!canSubmit}
            whileHover={canSubmit ? { scale: 1.015 } : {}}
            whileTap={canSubmit ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={cn(
              'relative w-full overflow-hidden rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 ease-out',
              canSubmit
                ? 'bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 text-white shadow-elevation-2 hover:shadow-elevation-3'
                : 'cursor-not-allowed bg-secondary text-muted-foreground border border-border'
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
          </motion.button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Both links must be valid before you can submit.
          </p>
        </div>
      </form>
    </motion.div>
  );
}

function LinkRow({ icon, label, url }: { icon: ReactNode; label: string; url: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {url}
        </a>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
          <BadgeCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-foreground">Day 12 submitted</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
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
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/50 shadow-sm"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
          Edit submission
        </button>
        <Link
          to="/dashboard"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-elevation-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-3"
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
          <CalendarX className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-foreground">This day is past due</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">No submission · won’t count toward your streak</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        The window for Day 12 closed without a submission. That’s fine — it happens. The skill
        still matters, so the task stays open if you want to build it anyway; it just won’t be
        counted toward your streak.
      </p>

      {practiced && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-3.5 py-2.5 text-xs font-medium text-emerald-500">
          <Check className="h-4 w-4" aria-hidden="true" />
          You practiced this day on your own. Reps count, streaks don’t.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <button
          onClick={onPractice}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-elevation-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-elevation-3"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {practiced ? 'Practice it again' : 'Practice it on my own'}
        </button>
        <Link
          to="/dashboard"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 shadow-sm"
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
    <div className="mt-10 rounded-2xl border border-dashed border-border p-4 bg-card/60">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Dev · preview this day’s state
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          reset
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {VIEWS.map((v) => (
          <motion.button
            key={v.value}
            onClick={() => onSwitch(v.value)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative rounded-lg border px-3 py-2 font-mono text-xs transition-colors',
              view === v.value
                ? 'border-primary text-primary font-bold'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
            )}
          >
            {view === v.value && (
              <motion.div
                layoutId="devTabActive"
                className="absolute inset-0 rounded-lg bg-primary/10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{v.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function DayPage() {
  const [submission, setSubmission] = useState<Submission | null>(loadSubmission);
  const [view, setView] = useState<View>(() => (loadSubmission() ? 'submitted' : 'active'));
  const [mode, setMode] = useState<Mode>('active');
  const [phase, setPhase] = useState<Phase>('form');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [githubBlurred, setGithubBlurred] = useState(false);
  const [linkedinBlurred, setLinkedinBlurred] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState<Set<number>>(() => new Set());
  const [hintsOpen, setHintsOpen] = useState(false);
  const [practiced, setPracticed] = useState(false);

  const GITHUB_RE = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/(commit|blob|tree|releases\/tag)\/[A-Za-z0-9_.-]+(\/.*)?)?\/?$/i;
  const LINKEDIN_RE = /^https?:\/\/(www\.)?linkedin\.com\/(posts\/|feed\/update\/|pulse\/|embed\/feed\/update\/)[A-Za-z0-9_.-]+/i;

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
    setGithub('');
    setLinkedin('');
    setMode('practice');
    setPhase('form');
    setView('active');
  }

  function switchView(target: View) {
    setView(target);
    setPhase('form');
    if (target === 'active') {
      setMode(submission ? 'edit' : 'active');
      if (submission) {
        setGithub(submission.github);
        setLinkedin(submission.linkedin);
      }
    }
  }

  function resetDemo() {
    clearSubmission();
    setSubmission(null);
    setGithub('');
    setLinkedin('');
    setGithubBlurred(false);
    setLinkedinBlurred(false);
    setCheckedCriteria(new Set());
    setHintsOpen(false);
    setPracticed(false);
    setMode('active');
    setView('active');
    setPhase('form');
  }

  return (
    <div className="relative min-h-screen bg-background/95 text-foreground transition-colors duration-300 overflow-hidden">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <PerspectiveGrid />
      </div>
      <div className="pointer-events-none absolute -top-36 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-600/35 via-indigo-500/30 to-fuchsia-500/35 dark:from-violet-500/20 dark:to-indigo-500/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-100px] top-32 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-fuchsia-500/30 via-pink-500/25 to-violet-500/30 dark:from-fuchsia-500/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[-100px] top-72 h-[320px] w-[320px] rounded-full bg-gradient-to-tr from-indigo-500/30 via-sky-500/25 to-violet-500/30 dark:from-indigo-500/15 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 content-layer">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:h-16 sm:px-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
              <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
                AB<span className="text-primary">Talks</span>
              </span>
            </Link>
            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <span className="rounded-lg border border-border bg-card/60 px-2 py-1 font-mono text-xs text-muted-foreground">
                {DAY.number}/{DAY.total}
              </span>
            </div>
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
              <div className="flex items-center gap-2 font-digital text-sm text-primary">
                <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Day {DAY.number}
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{DAY.total}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {DAY.track}
                </Badge>
                <Badge className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-500">
                  {DAY.difficulty}
                </Badge>
                <Badge className="rounded-full border border-border bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {DAY.estimate}
                </Badge>
              </div>

              <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {DAY.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {DAY.brief}
              </p>

              <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/10 p-4 sm:p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Why this matters
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {DAY.why}
                </p>
              </div>
            </section>

            <section className="mt-8 sm:mt-10">
              <SectionHeading icon={ListChecks} title="Acceptance criteria" />
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Check off items as you complete them:</span>
                <span className="font-mono text-primary font-semibold">
                  {checkedCriteria.size} of {DAY.criteria.length}
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {DAY.criteria.map((c, i) => {
                  const done = checkedCriteria.has(i);
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => toggleCriteria(i)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200',
                        done
                          ? 'border-primary/40 bg-primary/10 text-foreground'
                          : 'border-border/80 bg-card hover:border-primary/40 hover:bg-card/80'
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all duration-200',
                          done
                            ? 'border-transparent bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500 text-white shadow-sm'
                            : 'border-border bg-secondary text-transparent'
                        )}
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span
                        className={cn(
                          'text-sm leading-relaxed transition-colors duration-200',
                          done ? 'text-muted-foreground line-through' : 'text-foreground'
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
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 shadow-sm"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                  <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  Stuck? Open a hint
                </span>
                <motion.span
                  animate={{ rotate: hintsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-muted-foreground"
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
                    <div className="mt-2 space-y-3 rounded-2xl border border-border bg-card/60 p-4">
                      {DAY.hints.map((h, i) => (
                        <p key={i} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                          <span className="font-mono text-primary font-bold">{i + 1}.</span>
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
                className="glass-card relative overflow-hidden p-5 sm:p-7"
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative">
                  <SectionHeading icon={Send} title="Submit today’s work" />
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
      </div>

      <AnimatePresence>
        {phase === 'success' && <SuccessOverlay key="success" mode={mode} />}
      </AnimatePresence>
    </div>
  );
}
