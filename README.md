# Verification of the precision of DFT implementations via AiiDA common workflows

Web application built with React (Vite), using

- Tailwind CSS, with the Materials Cloud header (mc-react-header) and
  components (mc-react-library)
- recharts
- visx

See the `python` directory on how the underlying data is obtained and prepared.

Published via GitHub pages to https://acwf-verification.materialscloud.org

## Development

For local development:

```
> pnpm install
> pnpm dev     # development server
> pnpm lint    # oxlint
> pnpm build   # production build in dist/
```

To publish a new version to GitHub pages:

```
> pnpm run deploy
```
