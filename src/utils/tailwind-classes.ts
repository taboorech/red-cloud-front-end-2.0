// Shared Tailwind class constants for theme-aware UI primitives.
// Page-level uppercase label base (no color) — for the "PLAYLIST", "PROFILE"
// style eyebrows above page titles. Compose with a `text-*` class.
export const PAGE_LABEL_BASE =
  "text-[11px] tracking-[0.18em] font-semibold uppercase";

// Default (theme-soft) variant — use when you don't need a custom color.
export const PAGE_LABEL_CLASS = `${PAGE_LABEL_BASE} text-app-text-soft`;

// Field-level uppercase label base (no color) — slightly tighter tracking,
// used above form inputs and cards. Compose with a `text-*` class.
export const FIELD_LABEL_BASE =
  "text-[11px] tracking-[0.16em] font-semibold uppercase";

// Default (theme-muted) variant — use when you don't need a custom color.
export const FIELD_LABEL_CLASS = `${FIELD_LABEL_BASE} text-app-text-muted`;

// Brand button base (theme-aware). Use for primary CTAs on pages.
// Does not set rounding — compose with `rounded-full` / `rounded-xl` etc.
export const BRAND_BUTTON_BASE =
  "bg-brand-500 hover:bg-brand-600 text-white font-semibold transition cursor-pointer disabled:opacity-60";
