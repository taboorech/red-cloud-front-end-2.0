// Pastel cream/peach gradient palette used for placeholders when no image is available.
// Visible diagonal-stripe overlay class is colocated for consistency.
export const PASTEL_GRADIENTS = [
  "linear-gradient(135deg, #c2776c, #d29b7a)",
  "linear-gradient(135deg, #8a7035, #b59465)",
  "linear-gradient(135deg, #5a7a4f, #80a17d)",
  "linear-gradient(135deg, #5a8589, #82a9a6)",
  "linear-gradient(135deg, #8094b5, #6b81a8)",
  "linear-gradient(135deg, #9b80b5, #b09bc7)",
];

// Visible diagonal stripes overlay — apply on top of a colored placeholder.
export const STRIPE_OVERLAY_CLASS =
  "pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.4)_0_2px,transparent_2px_8px)]";

export const hashToIndex = (seed: string | number | undefined, length: number): number => {
  if (seed === undefined || seed === null) return 0;
  const str = String(seed);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % length;
};

export const pickGradient = (seed: string | number | undefined): string =>
  PASTEL_GRADIENTS[hashToIndex(seed, PASTEL_GRADIENTS.length)];
