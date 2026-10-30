# Version Matrix & Compatibility Specification — TanStack Playground

## 1. Overview & Verification Audit

- **Audit Date**: October 30, 2026
- **Auditor**: Antigravity Core Architecture Team
- **Verification Method**: Live npm registry inspection (`npm view <pkg> version peerDependencies`) and OpenJDK / Spring Boot official release validation.

### Build Reproducibility Policy
- **Frontend**: Locked via `package-lock.json` committed to Git; installation strictly through `npm ci --engine-strict`.
- **Backend**: Locked via Maven Wrapper (`./mvnw`) and Spring Boot `3.4.2` parent BOM (`spring-boot-starter-parent`).

---

## 2. Core Infrastructure & Tooling Matrix

| Tool / Runtime | Target Version | Verification Date & Evidence | Role / Constraints |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v24.x LTS` / `v22.x LTS` | 2026-10-30 (`node -v` -> `v24.21.0`) | V8 engine runtime for Vite bundler |
| **npm** | `11.x` | 2026-10-30 (`npm -v` -> `11.19.0`) | Package manager with strict lockfile support |
| **Java JDK** | `Java 21 LTS` | 2026-10-30 (Temurin 25/21 LTS compatible) | Pattern matching, records, virtual threads |
| **Spring Boot** | `3.4.2` | 2026-10-30 (Maven Central stable release) | Production Java framework with Spring MVC 6.2 |
| **PostgreSQL** | `16.x` | 2026-10-30 (Neon Serverless PostgreSQL 16) | Relational engine with JSONB & SSL |
| **Vite** | `^6.1.0` | 2026-10-30 (`npm view vite version`) | Fast client-side bundler and HMR engine |
| **TypeScript** | `^5.7.3` | 2026-10-30 (`npm view typescript version`) | Static type analysis for curriculum & app |

---

## 3. Frontend Core Libraries Matrix

| Package Name | Selected Version | React Compatibility | TypeScript Compatibility | Verified Peer Dependencies | Verification Evidence & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `react` | `^19.0.0` | Target | `^5.7.0` | None | Core UI rendering engine |
| `react-dom` | `^19.0.0` | Target | `^5.7.0` | `react@^19.0.0` | DOM bindings for React 19 |
| `@types/react` | `^19.0.8` | React 19 | `^5.7.0` | None | Type definitions for React 19 |
| `@types/react-dom` | `^19.0.3` | React 19 | `^5.7.0` | None | Type definitions for React DOM |
| `tailwindcss` | `^4.0.0` | React 19 | Any | `@tailwindcss/vite` | Modern utility styling engine |
| `@tailwindcss/vite` | `^4.0.0` | React 19 | Any | `vite@^6.0.0`, `tailwindcss` | Official Vite plugin for Tailwind v4 |
| `lucide-react` | `^1.65.0` | React 18 / 19 | Any | `react` | Verified: direct React 19 support |
| `@monaco-editor/react`| `^4.7.0` | `^16.8 \|\| ^17 \|\| ^18 \|\| ^19` | `^5.0.0` | `monaco-editor >= 0.25.0 < 1` | Verified peer: React 19 compatible |
| `monaco-editor` | `^0.52.2` | N/A | `^5.0.0` | None | Core browser editor engine |
| `@codesandbox/sandpack-react` | `^2.20.0` | `^16.8 \|\| ^17 \|\| ^18 \|\| ^19` | `^5.0.0` | `react`, `react-dom` | Verified peer: React 19 compatible |
| `recharts` | `^3.10.1` | `^16.8 \|\| ^17 \|\| ^18 \|\| ^19` | `^5.0.0` | `react`, `react-dom` | Verified peer: React 19 compatible |
| `zod` | `^3.24.2` | Independent | `^5.0.0` | None | Schema validator for forms & manifests |
| `clsx` | `^2.1.1` | Any | Any | None | Class utility |
| `tailwind-merge` | `^3.0.1` | Any | Any | None | Tailwind class conflict resolution |
| `axios` | `^1.7.9` | Any | Any | None | HTTP client with `withCredentials` support |

---

## 4. TanStack Ecosystem Libraries Matrix

| Library Name | Official Package | Verified Version | Maturity Status | Framework Support | Verification Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TanStack Query** | `@tanstack/react-query` | `^5.105.0` | **Production Stable** | React, Solid, Vue, Svelte | Verified peer: `react: ^18 \|\| ^19` |
| **TanStack Router** | `@tanstack/react-router` | `^1.170.46` | **Production Stable** | React | Verified peer: `react: >=18 \|\| >=19` |
| **TanStack Table** | `@tanstack/react-table` | `^8.21.2` | **Production Stable** | Universal / React | Verified peer: `react: >=18` |
| **TanStack Form** | `@tanstack/react-form` | `^1.33.5` | **Production Stable** | React, Solid, Vue, Svelte | Verified peer: `react: ^17 \|\| ^18 \|\| ^19` |
| **TanStack Virtual**| `@tanstack/react-virtual` | `^3.14.24` | **Production Stable** | React, Solid, Vue, Svelte | Verified: React 18 & 19 compatible |
| **TanStack Store** | `@tanstack/store`, `@tanstack/react-store` | `^0.11.2` | **Stable Core** | React, Universal | Verified: Core state store |
| **TanStack Start** | `@tanstack/react-start` | `^1.169.4` | **Release Candidate** | React (Nitro SSR) | **Note**: Browser Sandpack cannot execute native Node.js/Nitro SSR. Runs via client RPC simulator. |
| **TanStack DB** | `@tanstack/db` | `^1.0.0-rc.1` | **Release Candidate** | Universal / TypeScript | Verified: Client reactive sync store |
| **TanStack Pacer** | `@tanstack/pacer` | `^0.23.1` | **Beta** | Universal / TypeScript | Verified: Debounce/throttle utilities |
| **TanStack Devtools** | `@tanstack/react-query-devtools`, `@tanstack/router-devtools` | `^5.105.0`, `^1.167.2` | **Production Stable** | React | Embedded in sandbox templates |
| **TanStack Ranger**| `@tanstack/react-ranger` | `^0.0.5` | **Alpha / Experimental** | React | Verified: Headless range/slider logic |
| **TanStack Hotkeys**| `@tanstack/react-hotkeys`, `@tanstack/hotkeys` | `^0.17.0`, `^0.18.0` | **Beta** | React, Vanilla | Verified: Keyboard shortcut hooks |
| **TanStack AI** | `@tanstack/ai` | `^1.0.1` | **Release Candidate** | Universal / TypeScript | Verified: Streaming AI workflows |

---

## 5. Backend Dependency Matrix (Spring Boot 3.4.x / Java 21)

| Group ID : Artifact ID | Version | Source | Role / Constraints |
| :--- | :--- | :--- | :--- |
| `org.springframework.boot:spring-boot-starter-web` | `3.4.2` | Spring Boot BOM | REST controllers, Jackson JSON parser |
| `org.springframework.boot:spring-boot-starter-data-jpa` | `3.4.2` | Spring Boot BOM | Hibernate 6 ORM, Spring Data JPA |
| `org.springframework.boot:spring-boot-starter-security` | `3.4.2` | Spring Boot BOM | Security filter chains, BCrypt |
| `org.springframework.boot:spring-boot-starter-validation` | `3.4.2` | Spring Boot BOM | Jakarta Bean Validation 3.0 |
| `org.springframework.boot:spring-boot-starter-actuator` | `3.4.2` | Spring Boot BOM | Health check `/actuator/health` |
| `org.postgresql:postgresql` | `42.7.5` | Managed | PostgreSQL JDBC driver with TLS |
| `io.jsonwebtoken:jjwt-api` | `0.12.6` | Direct | JWT access token creation and parsing |
| `io.jsonwebtoken:jjwt-impl` | `0.12.6` | Direct (Runtime) | JJWT runtime engine |
| `io.jsonwebtoken:jjwt-jackson` | `0.12.6` | Direct (Runtime) | JJWT Jackson JSON integration |
| `org.springdoc:springdoc-openapi-starter-webmvc-ui` | `2.8.5` | Direct | OpenAPI 3.0 specification & Swagger UI |
| `org.projectlombok:lombok` | `1.18.36` | Managed | Boilerplate reduction for models |

---

## 6. Execution Strategy Realism Disclaimer

### TanStack Start & Browser Sandbox Boundaries
- **Fundamental Constraint**: `TanStack Start` is an isomorphic, full-stack React framework built on Vite and the Nitro server engine. Standard web browsers cannot run a native Node.js process, POSIX sockets, or execute true server-side HTML streaming without an external container.
- **Simulator Policy**: TanStack Playground explicitly labels TanStack Start lessons as running inside a **Server Function RPC Simulator**. The simulator replicates `createServerFn` type contracts, argument validation, asynchronous latency, and separate server console logs. It does **not** claim to execute live Nitro/Node.js server-side rendering in the browser.
