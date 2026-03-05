# Crosswinds Band Site

See [spec](./docs/SPEC.md) for details.

## Developer

**Prerequisites:** Node 20+ and pnpm 10+.

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:4321)
pnpm dev

# Production build
pnpm build

# Preview production build locally
pnpm preview
```

### Testing

```bash
# Unit & component tests (Vitest)
pnpm test

# Watch mode
pnpm test:watch

# End-to-end tests (Playwright — requires a build first)
pnpm build && pnpm test:e2e
```

On first run, install Playwright browsers with `npx playwright install`.

### Deployment

Push to the `main` branch to trigger the GitHub Actions workflow that builds and deploys to GitHub Pages.