# TanStack Playground

> An interactive, production-quality learning platform for mastering the TanStack ecosystem through editable, runnable examples.

## Documentation Index (Architecture & Technical Specifications)

Comprehensive technical specifications, security models, and architecture documentation:

- [System Architecture](docs/ARCHITECTURE.md) — System topology, component boundaries, React 19 + Monaco + Sandpack hybrid execution model, Spring Boot backend structure, and HttpOnly cookie security.
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md) — Authoritative 13-phase engineering roadmap (Phase 0 through Phase 12) with verification milestones and quality gates.
- [Database Design](docs/DATABASE_DESIGN.md) — Neon PostgreSQL relational schema, ER diagrams, refresh token rotation, JSONB virtual file specifications, indexes, and initial DDL migrations.
- [API Contracts](docs/API_CONTRACTS.md) — RESTful API endpoint specifications (`/api/v1/tracks`), cookie-based authentication, request/response JSON payloads, and HTTP status codes.
- [Lesson Format & Registry](docs/LESSON_FORMAT.md) — Declarative TypeScript and Zod schemas for multi-file learning manifests, sandbox runtime configs, TanStack Start RPC simulation, and concrete curriculum examples.
- [Version Matrix](docs/VERSION_MATRIX.md) — Authoritative dependency version matrix, peer dependency compatibility, and build reproducibility policies.
- [Security Review](docs/SECURITY_REVIEW.md) — Threat modeling, sandbox iframe isolation, CSRF defense, CORS configuration, and backend payload limits.
