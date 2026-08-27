// Single source of truth for how a Trivy letter grade is coloured.
//
// Kept dependency-free ON PURPOSE: this is imported by the catalog's client-side
// script as well as by server-rendered components, and `artifacthub.ts` pulls in the
// whole security.json snapshot, which must never reach the browser bundle.
//
// The grades come from scripts/scan-images.mjs:
//   A+  no findings at all
//   A   findings exist but every one is UNKNOWN severity -- nothing is known to be
//       exploitable yet, so it does NOT get a known-severity penalty. Distinct colour
//       from A+ so "clean" and "untriaged" never look identical.
//   B   LOW severity present
//   C   MEDIUM      D  HIGH      F  CRITICAL
export type GradeTone = 'perfect' | 'info' | 'warn' | 'bad';

export function gradeTone(grade?: string | null, hasCves = false): GradeTone {
  if (!grade) return hasCves ? 'warn' : 'perfect';
  if (grade === 'A+') return 'perfect';
  if (grade === 'A') return 'info';
  if (grade === 'B' || grade === 'C') return 'warn';
  return 'bad';
}

// A+ green (clean), A sky-blue (informational: severity not yet known), B/C amber,
// D/F red. Blue rather than a second green so the two top grades are told apart at a
// glance, and by hue rather than by shade alone.
export const GRADE_CHIP: Record<GradeTone, string> = {
  perfect: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  info: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  warn: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  bad: 'border-red-500/40 bg-red-500/10 text-red-300',
};

export const GRADE_DOT: Record<GradeTone, string> = {
  perfect: 'bg-emerald-500',
  info: 'bg-sky-500',
  warn: 'bg-amber-500',
  bad: 'bg-red-500',
};

// Why a grade is what it is -- shown in the badge tooltip so "A" is self-explanatory.
export function gradeNote(grade?: string | null): string {
  return grade === 'A'
    ? 'every finding is UNKNOWN severity, so none is known to be exploitable yet'
    : '';
}
