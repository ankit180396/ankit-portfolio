# Architecture

## Recruiter experience

The home page is statically rendered for speed and search visibility. Interactive project filtering and the portfolio assistant hydrate only the client components that need browser state.

```mermaid
flowchart TD
  A[Recruiter opens portfolio] --> B[Static profile and case studies]
  A --> C[Project filters]
  A --> D[Ask Ankit AI]
  D --> E[Validated server request]
  E --> F[Deterministic knowledge retrieval]
  F --> G{AI Gateway available?}
  G -->|Yes| H[Grounded AI answer with source labels]
  G -->|No| I[Extractive answer from verified chunks]
```

## AI request path

1. The browser submits a bounded conversation to `POST /api/chat`.
2. The route rejects oversized payloads, excessive conversation history, and overlong questions.
3. An approximate in-memory limiter reduces casual abuse. For sustained public traffic, replace it with a durable rate limiter such as Upstash Redis or a platform-level rule.
4. The latest recruiter question is tokenized and scored against the curated chunks in `lib/profile.ts`.
5. The top evidence is placed into a constrained system prompt.
6. Vercel AI Gateway synthesizes a concise answer when authentication, credits, and the selected model are available.
7. Every generated answer must contain one of the retrieved source labels. If generation fails or violates that contract, the route returns an extractive answer built directly from the verified chunks.
8. Unsupported questions are refused rather than filled with unrelated profile facts.

## Why there is no vector database

The current knowledge base is small and changes infrequently. Keyword retrieval is faster to audit, adds no storage dependency, and avoids embedding cost. A vector database becomes useful only if the corpus expands to many long project documents, talks, articles, or code explanations.

## Reliability and privacy decisions

- The assistant answers only from curated public facts.
- Source labels are part of the response contract.
- A deterministic retrieval-only response keeps the chat useful when the hosted model is unavailable.
- Retrieval-only answers copy the curated evidence rather than generating new claims.
- Output is capped to keep answers concise and costs bounded.
- The browser never receives an AI credential.
- The assistant excludes sensitive personal and confidential client information.
- The portfolio and Q&A experience remain useful if AI Gateway is unavailable.

## Production hardening path

For higher traffic, add a durable IP or session rate limiter, bot detection, explicit per-project AI Gateway budgets, error telemetry without prompt logging, and a small evaluation suite covering factuality, refusal behavior, and prompt injection.
