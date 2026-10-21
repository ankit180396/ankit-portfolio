# Ankit Choudhary · Portfolio

A recruiter-first engineering portfolio built with Next.js, TypeScript, and the Vercel AI SDK. The site combines evidence-based case studies with a bounded AI assistant that answers questions from a curated public knowledge base.

## Why this repository exists

The repository is both the source for the live portfolio and a public engineering sample. It demonstrates:

- clear component and content boundaries;
- server-side AI integration with a deterministic retrieval fallback;
- deterministic retrieval before generation;
- input validation, bounded context, output limits, and basic abuse controls;
- accessible, responsive interaction design;
- metadata, structured data, robots, and sitemap support;
- automated tests, type checking, and production builds.

## Stack

- Next.js App Router
- React and TypeScript
- Vercel AI SDK and AI Gateway
- CSS without a runtime styling dependency
- Node test runner

## Run locally

```bash
npm install
npm run dev
```

The main portfolio and retrieval-only Q&A work without an AI credential. To enable generative answers locally, copy `.env.example` to `.env.local` and provide an AI Gateway credential or use a linked Vercel project's OIDC environment.

```bash
cp .env.example .env.local
```

Never commit `.env.local` or an API key.

## Verification

```bash
npm run test
npm run typecheck
npm run build
```

## AI assistant design

The assistant does not use a database for its small public corpus. Each question is matched against curated knowledge chunks with deterministic keyword scoring. Only the most relevant chunks are passed to the model. If AI Gateway is unavailable, or if a generated response omits its required source label, the API returns an extractive answer directly from those chunks. This keeps the system inexpensive, inspectable, and functional without model access.

The public assistant intentionally excludes phone numbers, compensation, immigration details, home addresses, and confidential client data. It is instructed to say when the evidence is missing rather than improvise.

See [docs/architecture.md](docs/architecture.md) for the request flow and tradeoffs.

## Deployment

The application is designed for Vercel. A Vercel deployment can authenticate to AI Gateway through OIDC, which avoids exposing a provider key in source or client-side JavaScript. Set `AI_GATEWAY_MODEL` to a current model identifier if you want to override the documented default.

## License

Code is available under the MIT License. Professional background content and personal imagery remain the property of Ankit Choudhary.
