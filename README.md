# TanStack Playground

<div align="center">

[![React 19](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6db33f?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TanStack](https://img.shields.io/badge/TanStack-Ecosystem-ef4444?logo=tanstack&logoColor=white)](https://tanstack.com)
[![Monaco Editor](https://img.shields.io/badge/Editor-Monaco-007acc?logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![Sandpack](https://img.shields.io/badge/Engine-CodeSandbox_Sandpack-black)](https://sandpack.codesandbox.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A production-grade, interactive learning and code execution platform engineered for the complete TanStack ecosystem.**

[Live Demo](https://tanstack-playground.vercel.app) • [Architecture](docs/ARCHITECTURE.md) • [Deployment Guide](docs/DEPLOYMENT.md) • [Lesson Authoring](docs/LESSON_AUTHORING.md) • [API Contracts](docs/API_CONTRACTS.md)

</div>

---

## 1. Project Overview

**TanStack Playground** is an interactive educational platform designed to master the entire TanStack library ecosystem through real, editable, and runnable code sandboxes. Rather than reading static documentation, developers experiment with working multi-file applications, adjust live simulation parameters (such as network latency and artificial error rates), and observe instantaneous changes in an isolated browser-side execution sandbox.

### Supported Libraries & Modules:
- **TanStack Query (v5)**: Queries, keys, caching, stale time, garbage collection, mutations, query invalidation, optimistic updates, pagination, infinite scroll, dependent queries, parallel fetching, and AbortSignal cancellation.
- **TanStack Table (v8)**: Headless table architectures, column definitions, single & multi-column sorting, faceted filtering, global search, pagination, row selection, editable cells, and server-side SQL simulation.
- **TanStack Router (v1)**: Type-safe routing, route hierarchies, path parameters, search parameters, loaders, route context, navigation, error boundaries, auth guards, and Query integration.
- **TanStack Form (v0.x)**: Form lifecycles, field-level validation, async validation, dependent fields, dynamic field arrays, and server validation error mapping.
- **TanStack Virtual (v3)**: High-performance virtualization for lists, dynamic row heights, horizontal scrolling, and 2D virtualized grids.
- **TanStack Start**: Server functions, file-based routing architecture, SSR, hydration, and streaming boundaries.
- **TanStack DB**: Reactive collections, live queries, optimistic mutations, and real-time synchronization.
- **TanStack Store**: Framework-agnostic atomic reactive state management and derived selectors.
- **TanStack Pacer**: Interactive rate-limiting, debouncing, throttling, batching, and scheduling.
- **TanStack Devtools**: Query inspection, status indicators, and cache monitors.
- **TanStack Ranger**: Multi-thumb range sliders and custom step intervals.
- **TanStack Hotkeys**: Modifier keys, key chords, and global shortcuts.
- **TanStack AI**: Streaming chat completions, LLM tool execution, and protected proxy architecture.

---

## 2. Platform Preview & Screenshots

### Interactive Dual-Pane Workspace
*Monaco code editor with full TypeScript syntax highlighting, multi-file explorer, collapsible theory panel, and real-time Sandpack execution with live simulation controls.*

```
+-----------------------------------------------------------------------------------------+
| [TS] TanStack Playground   Home > Libraries > Query > Basic Query    [Search ⌘K]  [Sign In] |
+-----------------------------------------------------------------------------------------+
|  THEORY PANEL        | FILES | MONACO CODE EDITOR            | LIVE PREVIEW & CONTROLS  |
|                      |-------+-------------------------------+--------------------------|
| Basic Query:         |App.tsx| import { useQuery } from ...  | [Simulated Delay: 800ms] |
| Lifecycle & Fetching |api/   | function UsersComponent() {   | [ ] Simulate HTTP 500    |
|                      | types/|   const { data, isPending } = |                          |
| - Automatic caching  |       |     useQuery({                | Engineering Team         |
| - Invalidation       |       |       queryKey: ['users'],    | - Tanner Linsley         |
| - Retry mechanics    |       |       queryFn: fetchUsers,    | - Dominik Dorfmeister    |
|                      |       |     });                       |                          |
| [Collapse Theory]    |       | [Save (Ctrl+S)] [Reset File]  | status: isPending: false |
+-----------------------------------------------------------------------------------------+
```

### Global Command Search Palette (`Ctrl+K` / `Cmd+K`)
*Instant reactive search across all 13 TanStack libraries, curriculum topics, and exported API symbols with keyboard navigation.*

---

## 3. Technology Stack

### Frontend Architecture
- **Framework**: React 19 SPA with TypeScript 5
- **Tooling & Bundler**: Vite 8 with Rollup
- **Routing**: `@tanstack/react-router` (Type-safe routing with search validation and layouts)
- **Data Fetching**: `@tanstack/react-query` (Server state caching and synchronization)
- **Code Editor**: `@monaco-editor/react` (VS Code editing experience with multi-tab support)
- **Execution Engine**: `@codesandbox/sandpack-react` (Client-side isolated in-browser bundler)
- **Styling**: Tailwind CSS v4, `@radix-ui` primitives, and `lucide-react`
- **Notifications**: `sonner` toast management
- **Testing**: Vitest, React Testing Library, and Playwright

### Backend Architecture
- **Framework**: Spring Boot 3.4.2 (Java 21)
- **Security**: Spring Security 6 with stateless JWT (`jjwt 0.12.6`), BCrypt (strength 12), and CORS protection
- **Data Persistence**: Spring Data JPA (Hibernate 6)
- **Migrations**: Flyway (`flyway-core` + `flyway-database-postgresql`)
- **Connection Pool**: HikariCP (optimized for serverless scale-to-zero)
- **Databases**:
  - **Production**: Neon Serverless PostgreSQL 16 (SSL required)
  - **Development**: In-memory PostgreSQL-compatible H2 with auto-seeding
- **Monitoring**: Spring Boot Actuator (`/actuator/health`)

---

## 4. Local Setup & Quickstart

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10.x+
- **Java**: JDK 21+ (Eclipse Temurin recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/YourUsername/TanStack-Playground.git
cd TanStack-Playground
```

### 2. Start Backend Service
```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run
# macOS / Linux:
./mvnw spring-boot:run
```
* The backend runs on `http://localhost:8080`.
* Pre-seeded with a demo user: `demo@tanstack.dev` / `password123`.
* Swagger API documentation available at `http://localhost:8080/swagger-ui.html`.

### 3. Start Frontend Client
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
* The Vite dev server runs at `http://localhost:5173`.
* Requests to `/api/*` are automatically proxied to `http://localhost:8080`.

---

## 5. Environment Variables

### Backend Configuration

| Variable | Default (Dev) | Production Description |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | `dev` | Set to `prod` in production. |
| `PORT` | `8080` | Web server listening port. |
| `SPRING_DATASOURCE_URL` | H2 In-Memory | Neon PostgreSQL JDBC URL (`jdbc:postgresql://<neon-host>/neondb?sslmode=require`). |
| `SPRING_DATASOURCE_USERNAME`| `sa` | Neon database username. |
| `SPRING_DATASOURCE_PASSWORD`| *(empty)* | Neon database password. |
| `JWT_SECRET` | Pre-configured dev key | 64+ character random hex string. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...` | Comma-separated list of allowed frontend origins (e.g. `https://tanstack-playground.vercel.app`). |

### Frontend Configuration (`frontend/.env`)

| Variable | Default (Dev) | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | *(empty string)* | Points to deployed Render backend (e.g. `https://tanstack-playground-backend.onrender.com`). If empty, uses Vite proxy `/api`. |

---

## 6. Production Deployment

The project is structured for independent, zero-maintenance production deployment:

### 1. Neon PostgreSQL
1. Create a serverless project at [neon.tech](https://neon.tech).
2. Copy the **JDBC SSL** connection string: `jdbc:postgresql://<neon-host>/neondb?sslmode=require`.
3. Spring Boot applies Flyway migrations (`V1__initial_schema.sql`, `V2__seed_metadata.sql`) automatically.

### 2. Render Backend
1. Connect repository in [Render](https://render.com) using the included [`render.yaml`](render.yaml) Blueprint or as a Docker Web Service pointing to [`backend/Dockerfile`](backend/Dockerfile).
2. Set environment variables: `SPRING_PROFILES_ACTIVE=prod`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, and `JWT_SECRET`.
3. Set health check path to `/actuator/health`.

### 3. Vercel Frontend
1. Import repository in [Vercel](https://vercel.com) with framework preset **Vite** and root directory **`frontend`**.
2. Add environment variable: `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`.
3. Single Page Application (SPA) routing is pre-configured via [`frontend/vercel.json`](frontend/vercel.json).

*For comprehensive step-by-step instructions and troubleshooting, see the [Production Deployment Guide](docs/DEPLOYMENT.md).*

---

## 7. Comprehensive Feature List

- [x] **13 Modular TanStack Tracks**: Complete coverage of Query, Table, Router, Form, Virtual, Start, DB, Store, Pacer, Devtools, Ranger, Hotkeys, and AI.
- [x] **Monaco Code Editor**: VS Code core, TypeScript syntax highlighting, multi-file tabs, font-size control, line numbers, word wrap, formatting, and file diffing.
- [x] **Live Sandpack Execution**: In-browser bundling with auto-recompile debounce (600ms), manual Run, and instant Save (`Ctrl+S`).
- [x] **Interactive Simulation Controls**: Latency sliders, error toggles, retry counts, and cache invalidation buttons that alter runtime code.
- [x] **Command Palette Search (`Ctrl+K`)**: Multi-token search with tag filters and keyboard navigation across all curriculum modules and APIs.
- [x] **Dual-Pane Resizable Layout**: Theory panel collapse/expand, horizontal and vertical draggable split panes, and full-screen preview modes.
- [x] **Console Stream**: Built-in runtime console capturing logs, warnings, errors, and object structures.
- [x] **Anonymous & Authenticated Modes**: Full platform functionality available without logging in; optional registration to sync progress, bookmarks, and custom overrides.
- [x] **State Persistence**: Browser `localStorage` for offline edits and Neon PostgreSQL database synchronization for authenticated users.
- [x] **Accessibility & SEO**: WCAG 2.1 AA compliant contrast, keyboard navigation, Open Graph tags, and Twitter cards.

---

## 8. Documentation Index

- [Architecture Specification](docs/ARCHITECTURE.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Lesson Authoring Guide](docs/LESSON_AUTHORING.md)
- [API Contracts & Security](docs/API_CONTRACTS.md)
- [Database Schema & Migrations](docs/DATABASE_DESIGN.md)
- [Dependency Version Matrix](docs/VERSION_MATRIX.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 9. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
