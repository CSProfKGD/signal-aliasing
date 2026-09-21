# Signal Aliasing

A minimal interactive explanation of signal aliasing: two analytic cosines, shared samples, and two frequency controls on a black stage.

[Open the interactive demo](https://csprofkgd.github.io/signal-aliasing/)

## Run locally

Requires Node.js 22.18+ and pnpm.

```sh
pnpm install
pnpm dev
```

Open the local address printed by Vite (by default http://127.0.0.1:5173/).

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

The production output is in `dist/`. GitHub Actions tests and builds each push to `main`, then publishes the result to GitHub Pages. The deployment sets `VITE_BASE_PATH=/signal-aliasing/` so scripts, styles, and the favicon resolve beneath the repository URL. Local development retains `/` as its base path.

See `context.md` for the design and signal model, and `AGENTS.md` for maintenance instructions.
