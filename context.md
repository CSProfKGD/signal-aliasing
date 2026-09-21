# Signal Aliasing — context

## Product brief

An interactive educational page that reveals how a high-frequency sinusoid and a lower-frequency reconstruction can produce exactly the same samples. Its presentation follows the Global vs rolling shutter project: a black Apple Keynote-style stage, compact bold top-left heading, muted subtitle, and minimal aqua sliders.

Exact hero copy:

- `Signal Aliasing`
- `High frequencies in disguise.`

The user approved correcting the original subtitle spelling to `disguise`. The supplied screenshot establishes the overlaid true signal, alias, and shared sampling dots. Screenshot labels, axes, arrows, and explanatory text are not requirements and must not be reproduced.

## Resolved decisions

- The user selected two curves plus sample dots, stationary and updated only through the sliders.
- After reviewing the local page, the user authorized a GitHub repository, commit and push, and a GitHub Pages website. The public repository is `CSProfKGD/signal-aliasing`; the website URL is `https://csprofkgd.github.io/signal-aliasing/`.
- SVG displays the analytic true signal in periwinkle `#899ce8`, the reconstructed alias in aqua `#63e6de`, and sample dots in warm ivory `#f2edda`.
- The plot has no visible labels, axes, gridlines, or legend. A screen-reader description identifies both curves and their relationship.
- The full-width plot fades to transparent across its first and last 10%, using a CSS opacity mask. Amplitude is unchanged.
- Two controls sit below the plot, with labels and current values. Desktop uses inline rows; narrow layouts put the track under each label/value pair.
- Both controls display `Hz`, with labels `Signal frequency` and `Sampling frequency`. Sampling frequency counts samples per second, while signal frequency counts cycles per second; the shared unit makes their comparison direct.
- Native sliders reuse the shutter project's 2px tracks, 13px round aqua handles, subtle hover enlargement, and keyboard focus treatment. The user requested removing the thumb halo; thumbs have no shadow or halo at rest or on hover.
- Following the visual review, title tracking is relaxed to `-.045em`. Slider labels use quieter gray `#c4c4ca`, `1rem` text, and weight `500`. Numeric values remain aqua at medium weight `500`; units are smaller neutral gray at weight `400`. Each output has a fixed `3.5ch` right-aligned numeric column and a separate left-aligned unit column, so both rows line up regardless of unit length. A narrower output column and `0.875rem` row gaps bring values closer to the tracks. The clear keyboard-focus outline remains.

| Control | Minimum | Maximum | Step | Default |
| --- | --- | --- | --- | --- |
| Signal frequency | 0.5 Hz | 12 Hz | 0.1 Hz | 4 Hz |
| Sampling frequency | 1 Hz | 30 Hz | 0.1 Hz | 3 Hz |

## Model

The time window is always `[-1, 1]` seconds, with unit amplitude and zero-phase cosine:

`x(t) = cos(2πft)`

Samples are taken at `t_n = n/f_s` for integer indices within the window. The baseband representative is:

`f_a = f - f_s floor(f/f_s + 0.5)`

`x_a(t) = cos(2πf_a t)`

Because `f - f_a` is an integer multiple of the sampling rate, both signals agree at every sample. The default 4 Hz source sampled at 3 samples/s reconstructs as a 1 Hz cosine. Above twice the source frequency, the curves coincide. At equality they also coincide for this fixed-phase cosine, without implying unique general-phase reconstruction at Nyquist. Integer frequency/rate ratios give a constant +1 reconstruction. Negative signed aliases are retained in the calculation; cosine symmetry permits displaying their magnitude in accessible descriptions.

The reconstruction is a mathematically consistent lowest-frequency sinusoid, not a spline through a finite set of points. No measurement noise, anti-alias filter, finite-window sinc artifacts, or animation are simulated.

## Implementation

React, TypeScript, and Vite power one page. `src/signal.ts` contains deterministic math and geometry; `src/main.tsx` contains the controls and responsive SVG; `src/styles.css` contains reference-derived styling. Geometry uses at least 64 segments per cycle and at least one segment per CSS pixel. SVG stays sharp on high-density screens.

`AGENTS.md` contains maintenance instructions and development commands. `tests/signal.test.ts` checks all 33,756 slider combinations and explicit aliasing, Nyquist, constant, sample-spacing, and responsive-geometry cases.

## Status

The page is implemented, with a local preview at `http://127.0.0.1:5173/`. GitHub Pages publication uses `.github/workflows/pages.yml`: pushes to `main` run the mathematical tests and type-checked production build, then deploy `dist/`. The workflow sets `VITE_BASE_PATH` to the repository subpath; local development retains its root path.

Validation completed:

- `pnpm typecheck`, `pnpm test`, and `pnpm build` pass.
- All seven tests pass. Across every one of the 33,756 slider combinations, the largest sample mismatch was approximately `2.43e-14`, below the `1e-10` requirement.
- Browser checks covered slider minima/maxima, 0.1-step keyboard changes, pointer dragging of both sliders, constant aliases, and exact SVG path equality during oversampling.
- Layout checks covered 320px and 1440px CSS viewport widths and 200% root text size, without horizontal overflow. Control column sizing uses rem units so text enlargement remains usable.
- The local high-density preview shows smooth curves, shared sample points, and symmetric edge fades. No browser warnings or errors were observed.
- Temporary text-size and viewport overrides were removed and the preview was restored to its default 4 Hz / 3 samples/s state.
