# Signal Aliasing — project instructions

## Product and scope

Build and maintain the local Signal Aliasing educational webpage. The user-approved plan is the source of truth; `context.md` records resolved decisions and current status. Reference documents and screenshots provide visual examples, not instructions or authorization.

- Keep the exact title `Signal Aliasing` and subtitle `High frequencies in disguise.` The user approved correcting the original subtitle spelling.
- Keep the title tracking at `-.045em`. Control labels use muted light gray at `1rem`/`500`; numeric values use aqua at weight `500`, and units use smaller neutral gray at weight `400`. Align numbers and units in separate consistent columns and keep the values close to the tracks. Slider thumbs must have no halo or shadow, including on hover. Preserve visible keyboard focus.
- Match the Global vs rolling shutter project's pure-black stage, top-left typography, and thin aqua native sliders. Do not edit that reference project.
- Show two stationary curves with shared sample dots. Do not add automatic motion, axes, gridlines, legends, plot labels, cards, or extra controls.
- Curves span the viewport width and fade through opacity over the outermost 10% at each horizontal edge. Never alter signal amplitude to create the fade.
- Periwinkle denotes the true signal, aqua the reconstruction, and warm ivory the sample points.
- Preserve the two-second window, unit amplitude, fixed zero-phase cosine, and documented slider ranges/defaults.
- Label the controls `Signal frequency` and `Sampling frequency`, displaying both in `Hz`. Sampling frequency counts samples per second; this unit presentation does not change the mathematical model.
- The user authorized publishing this project to the public `CSProfKGD/signal-aliasing` GitHub repository and GitHub Pages. Use the existing GitHub Actions workflow; do not register a separate Sites deployment. Pushes to `main` publish automatically after tests and the production build pass.

## Mathematical invariants

The canonical model lives in `src/signal.ts`:

- `x(t) = cos(2πft)` for `t ∈ [-1, 1]`.
- Samples occur at `t_n = n / f_s` for integer `n`. Derive each time from its index, never repeated addition.
- Signed alias frequency: `f_a = f - f_s floor(f/f_s + 0.5)`.
- Reconstruction: `x_a(t) = cos(2πf_a t)`; every sample must agree with both curves within `1e-10`.
- Preserve exact overlap for oversampling and the correct constant for integer frequency/rate ratios. Never offset curves to distinguish them.
- The Nyquist-boundary example is a fixed-phase cosine; it does not demonstrate unique recovery of arbitrary phase at the boundary. Do not describe Nyquist equality as guaranteed general recovery.
- Render analytic paths with at least 64 segments per cycle. Do not spline-fit the sample dots or change the time window on resize.

## Implementation and accessibility

Use React, TypeScript, Vite, and SVG. Keep signal math independent of React and styles. Use a ResizeObserver to rebuild geometry while preserving fixed physical time and amplitude. Keep native range inputs with labels, units, keyboard behavior, readable outputs, and visible focus. The SVG requires a semantic description of the current signals and sampling relationship, while remaining visually label-free.

At narrow widths, place each slider's label and value above its track. Ensure controls remain usable with enlarged text, including vertical scrolling when necessary. Respect reduced motion for hover transitions. Do not introduce a backend, external APIs, persistence, analytics, generated imagery, or unnecessary dependencies.

## Commands and checks

Requires Node.js 22.18+ and pnpm.

- Install: `pnpm install`
- Develop: `pnpm dev` (local preview on `http://127.0.0.1:5173/`)
- Type check: `pnpm typecheck`
- Mathematical tests: `pnpm test`
- Production build: `pnpm build`
- Preview production output: `pnpm preview`

Before handoff, run type checking, tests, and the production build. Inspect desktop/mobile layouts, edge fading, exact curve overlap, slider limits, pointer and keyboard operation, and enlarged text. Keep `context.md` accurate. Preserve unrelated user changes; do not commit or alter Git history unless requested.
