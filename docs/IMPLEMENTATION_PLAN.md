# Consolidated Implementation Plan — TanStack Playground

This implementation plan establishes the authoritative, sequential engineering roadmap for **TanStack Playground** across 13 consolidated phases (Phase 0 through Phase 12). Every phase defines its objective, tasks, deliverables, dependencies, acceptance criteria, and testing requirements.

---

## Roadmap Summary

| Phase | Title | Focus Area | Deliverable |
| :--- | :--- | :--- | :--- |
| **0** | **Technical Specifications & Architecture** | Architecture, security, DB, APIs, curriculum schema | 7 authoritative `docs/` specifications + Decision Log |
| **1** | **Project Setup & Frontend Foundation** | Vite + React 19 + Tailwind v4 + shadcn/ui | Clean compilable frontend foundation |
| **2** | **Backend & Database** | Spring Boot 3.4 + Neon PostgreSQL + JWT Cookie auth | Working REST API & Swagger UI |
| **3** | **Frontend Application Shell** | TanStack Router route tree, Layout, navigation | Interactive application shell |
| **4** | **Monaco + Sandpack Engine** | Monaco editor + Sandpack bundler VFS sync | Live multi-file runner and console panel |
| **5** | **TanStack Query Curriculum** | `useQuery`, mutations, invalidation, cache | Production-ready Query lessons |
| **6** | **TanStack Table Curriculum** | Column definitions, sorting, filtering, pagination | Production-ready Table lessons |
| **7** | **Router, Form & Virtual Curriculum** | Type-safe routing, Zod forms, DOM virtualization | Core ecosystem interactive modules |
| **8** | **Remaining Ecosystem Curriculum** | Start (RPC), DB, Store, Pacer, Devtools, Ranger, Hotkeys, AI | Extended ecosystem modules |
| **9** | **Authentication & User Personalization**| HttpOnly cookies, progress sync, bookmarks, preferences | Cloud sync and custom snippet sharing |
| **10** | **Testing & Quality Assurance** | Unit tests, integration tests, E2E smoke tests | Full test suite across frontend & backend |
| **11** | **Performance & Accessibility** | Monaco lazy-loading, code splitting, WCAG 2.1 AA | Sub-second loads & accessible UX |
| **12** | **Deployment & Production Verification** | Neon DB, Render API, Vercel SPA, DNS/SSL | Live public production release |

---

## Detailed Phase Specifications

### Phase 0: Technical Specifications & Architecture (Current Phase)
- **Objective**: Establish the technical foundations, version matrices, security models, database designs, API contracts, and curriculum schemas before writing code.
- **Tasks**:
  1. Complete pre-implementation audit resolving cross-site cookie behavior, Sandpack cross-origin isolation, Spring origin patterns, and path traversal validation.
  2. Author `docs/ARCHITECTURE.md` (System topology, Monaco/Sandpack hybrid engine, HttpOnly cookie security, Decision Log).
  3. Author `docs/DATABASE_DESIGN.md` (PostgreSQL relational schema, global lesson slug uniqueness, hardened path validation, DDL).
  4. Author `docs/API_CONTRACTS.md` (Cookie auth endpoints, uniform pagination envelope, 512KB JSON body enforcement).
  5. Author `docs/LESSON_FORMAT.md` (TypeScript & Zod manifest schema, TanStack Start RPC simulator realism disclaimer).
  6. Author `docs/IMPLEMENTATION_PLAN.md` (Authoritative 13-phase roadmap).
  7. Author `docs/VERSION_MATRIX.md` (Verified package versions, verification date, peer dependencies).
  8. Author `docs/SECURITY_REVIEW.md` (Threat modeling, Sandpack cross-origin SOP boundary, CSRF/CORS defenses).
- **Deliverables**: All 7 specification documents committed in `docs/`.
- **Dependencies**: None.
- **Acceptance Criteria**: All documents are mutually consistent, peer dependencies verified, and content ownership clearly separated.
- **Testing Requirements**: Schema validation tests on manifest Zod schemas and path traversal rejection regex.

---

### Phase 1: Project Setup & Frontend Foundation
- **Objective**: Initialize the frontend workspace with Vite, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.
- **Tasks**:
  1. Scaffold `frontend/` using Vite with `react-ts` template.
  2. Configure `@tailwindcss/vite` and Tailwind CSS v4 directives in `src/index.css`.
  3. Configure TypeScript paths (`@/*` -> `./src/*`) in `tsconfig.json` and `vite.config.ts`.
  4. Install and configure shadcn/ui primitives: `Button`, `Card`, `Tabs`, `Badge`, `Dialog`, `Sheet`, `Separator`, `DropdownMenu`, `Toast`.
  5. Install and verify core dependencies: `@tanstack/react-router`, `@tanstack/react-query`, `@tanstack/react-store`, `lucide-react`, `zod`, `axios`.
  6. Configure ESLint and Prettier for strict TypeScript formatting.
- **Deliverables**: Compilable `frontend/` application with working shadcn/ui demo component.
- **Dependencies**: Phase 0.
- **Acceptance Criteria**: `npm run build` completes with zero TypeScript or lint errors.
- **Testing Requirements**: Vitest unit test suite configuration; basic smoke test verifying React 19 mounting.

---

### Phase 2: Backend & Database
- **Objective**: Initialize the Spring Boot 3.4+ REST API with Java 21 LTS, Flyway database migrations, Neon PostgreSQL configuration, and Spring Security with HttpOnly cookie support.
- **Tasks**:
  1. Scaffold `backend/` using Maven Wrapper (`mvnw`) and Spring Boot 3.4.2 dependencies.
  2. Create `V1__initial_schema.sql` migration script implementing tables: `users`, `refresh_tokens`, `tracks`, `lessons` (with globally unique slugs), `user_lesson_progress`, `user_preferences`, `user_bookmarks`, `code_snippets`.
  3. Configure Tomcat JSON limits (`server.tomcat.max-http-form-post-size: 524288`) and Jackson stream constraints.
  4. Implement JPA entities with Lombok, audit timestamps, and JSONB mapping for VFS files.
  5. Implement `JwtService` and `CookieService` managing short-lived `jwt_access` and rotating `jwt_refresh` HttpOnly cookies.
  6. Implement `JwtAuthFilter` and configure `SecurityFilterChain` permitting public catalog endpoints and securing progress/preference endpoints.
  7. Configure CORS via `setAllowedOriginPatterns` permitting Vercel preview environments and local dev with `allowCredentials=true`.
  8. Implement Springdoc OpenAPI 3 metadata and Swagger UI (`/swagger-ui.html`).
- **Deliverables**: Runnable Spring Boot API with passing health check at `/actuator/health` and Swagger UI.
- **Dependencies**: Phase 0.
- **Acceptance Criteria**: Backend connects to Neon PostgreSQL over SSL, runs migrations, and serves `/api/v1/tracks`.
- **Testing Requirements**: Spring Boot integration tests verifying database connection, CORS patterns, and security filter chains.

---

### Phase 3: Frontend Application Shell
- **Objective**: Construct the TanStack Router route tree, global navigation, responsive layout shell, and theme management.
- **Tasks**:
  1. Configure TanStack Router route tree:
     - `/` (Landing page & ecosystem catalog)
     - `/tracks` (Track directory)
     - `/tracks/$trackSlug/$lessonSlug` (Dual-pane learning interface)
     - `/playground` (Standalone blank playground)
     - `/playground/$snippetSlug` (Shared snippet viewer)
  2. Implement global Header with logo, track selector, progress overview, and user account menu.
  3. Implement resizable dual-pane layout using `react-resizable-panels`:
     - Left pane: Lesson explanation, objectives checklist, code annotations, doc link.
     - Right pane: Workspace tabs, Monaco editor, Sandpack preview, and dockable console.
  4. Implement dark/light theme toggle integrated with Tailwind v4.
- **Deliverables**: Navigable application shell with responsive panel resizing.
- **Dependencies**: Phase 1.
- **Acceptance Criteria**: URL routes transition smoothly without page reloads; panel widths can be resized and reset.
- **Testing Requirements**: Router unit tests verifying param extraction and navigation guards.

---

### Phase 4: Monaco + Sandpack Engine
- **Objective**: Engineer the hybrid code editor and live preview subsystem with bi-directional virtual file system synchronization and cross-origin iframe security.
- **Tasks**:
  1. Wrap the workspace in `<SandpackProvider>` with custom theme styling matching shadcn/ui.
  2. Verify Sandpack loads from external bundler origin (`https://sandpack-bundler.codesandbox.io`) ensuring cross-origin SOP isolation.
  3. Build `MonacoWorkspace`:
     - Synchronize Monaco model content with Sandpack active file.
     - Multi-file tab bar supporting file switching (`App.tsx`, `api.ts`, `types.ts`).
     - Editor toolbar: Format Code (Prettier), Reset to Initial Code, Copy Code, Solution Toggle.
  4. Build `SandpackPreviewFrame`:
     - Custom sandboxed iframe container with loading spinner and reload button.
     - Friendly error overlay catching compilation and runtime exceptions with stack traces.
  5. Build `ConsolePanel`:
     - Intercept `console.log`, `warn`, and `error` from the iframe via validated `postMessage`.
     - Filter tabs (All, Logs, Warnings, Errors) and Clear Console action.
  6. Implement runaway loop recovery (destroying and re-mounting iframe).
- **Deliverables**: Fully interactive, multi-file code editing and live preview runner.
- **Dependencies**: Phase 1, Phase 3.
- **Acceptance Criteria**: Editing code in Monaco immediately reflects in Sandpack live preview; errors are captured gracefully without crashing the parent window.
- **Testing Requirements**: Component tests verifying editor file tab switching and reset action.

---

### Phase 5: TanStack Query Curriculum
- **Objective**: Implement comprehensive, production-quality, multi-file curriculum lessons for TanStack Query.
- **Tasks**:
  1. Author lesson manifests in `src/content/query/`:
     - `query-basics`: `useQuery`, `queryKey`, `queryFn`, loading/error states, in-memory mock API.
     - `stale-time-and-refetch`: Background fetching, window focus refetching, cache timers.
     - `mutations`: `useMutation`, optimistic updates, and cache invalidation via `queryClient.invalidateQueries`.
     - `pagination-infinite`: Paginated queries and `useInfiniteQuery` with load-more triggers.
  2. Create multi-file starter templates with realistic mock asynchronous latency and types.
  3. Add line annotations and hints for each lesson.
- **Deliverables**: Complete, runnable TanStack Query curriculum module.
- **Dependencies**: Phase 4.
- **Acceptance Criteria**: All 4 Query lessons execute cleanly in Sandpack with zero unhandled errors.
- **Testing Requirements**: Automated manifest validation asserting non-empty code and valid doc links.

---

### Phase 6: TanStack Table Curriculum
- **Objective**: Implement comprehensive multi-file curriculum lessons for TanStack Table.
- **Tasks**:
  1. Author lesson manifests in `src/content/table/`:
     - `table-basics`: Headless table architecture, `createColumnHelper`, `flexRender`.
     - `sorting`: Interactive column sorting with `getSortedRowModel` and visual sort indicators.
     - `filtering`: Global search filter and per-column faceted filtering with `getFilteredRowModel`.
     - `pagination-selection`: Client pagination, page size controls, and row selection state.
  2. Provide realistic dataset files (products, customers, transactions) in virtual files.
- **Deliverables**: Complete, runnable TanStack Table curriculum module.
- **Dependencies**: Phase 4.
- **Acceptance Criteria**: Table sorting, filtering, and pagination operate smoothly in live preview.
- **Testing Requirements**: Manifest validation asserting typed column helpers and dataset integrity.

---

### Phase 7: Router, Form & Virtual Curriculum
- **Objective**: Implement comprehensive curriculum modules for TanStack Router, TanStack Form, and TanStack Virtual.
- **Tasks**:
  1. **TanStack Router**:
     - Route trees, `createRoute`, and `Outlet` nested layouts.
     - Type-safe search parameters and loader prefetching.
  2. **TanStack Form**:
     - Reactive form instance with `useForm` and field bindings.
     - Synchronous and asynchronous schema validation with Zod.
     - Dynamic array fields and submission states.
  3. **TanStack Virtual**:
     - 10,000 item list virtualization with `useVirtualizer`.
     - Dynamic row height measurement and scrolling performance.
- **Deliverables**: Runnable lessons for Router, Form, and Virtual.
- **Dependencies**: Phase 4.
- **Acceptance Criteria**: Form validation shows instant errors; Virtualizer renders 10,000 items at 60 FPS.
- **Testing Requirements**: Schema compliance checks and Sandpack template smoke tests.

---

### Phase 8: Remaining TanStack Ecosystem Curriculum
- **Objective**: Author curriculum manifests for the broader TanStack ecosystem: Start, DB, Store, Pacer, Devtools, Ranger, Hotkeys, and AI.
- **Tasks**:
  1. **TanStack Start**: Implement `server-functions` lesson utilizing the **Server Function RPC Simulator**, demonstrating `createServerFn` execution and client/server boundaries (with explicit disclaimer).
  2. **TanStack DB**: Reactive local-first client database sync demonstrations.
  3. **TanStack Store**: Framework-agnostic store creation, fine-grained selectors with `useStore`.
  4. **TanStack Pacer**: Debouncing, throttling, and task queue demonstrations.
  5. **TanStack Devtools**: Integrating embedded devtools panels in sandbox previews.
  6. **TanStack Ranger & Hotkeys**: Headless sliders and keyboard shortcut listeners.
  7. **TanStack AI**: Streaming AI tool responses and client integrations.
- **Deliverables**: Extended ecosystem catalog with realistic execution harnesses.
- **Dependencies**: Phase 4, Phase 5.
- **Acceptance Criteria**: All projects have accurate maturity statuses; Start accurately simulates RPC boundaries.
- **Testing Requirements**: Static manifest verification for all extended tracks.

---

### Phase 9: Authentication & User Personalization
- **Objective**: Connect the frontend to the Spring Boot REST API for user registration, HttpOnly cookie login, progress synchronization, bookmarks, and custom playground sharing.
- **Tasks**:
  1. Build authentication dialogs: Register, Login, and Logout with `credentials: 'include'`.
  2. Connect lesson completion: "Mark as Completed" button updating `/api/v1/progress/{lessonSlug}`.
  3. Cloud Code Save: Auto-save or manual save of modified VFS files to backend `saved_files` JSONB (enforcing 512 KB limit and traversal regex).
  4. Reset Code Action: Reverts custom user code to original template via `/api/v1/progress/{lessonSlug}/reset`.
  5. Bookmarks Drawer: Add/remove bookmarks and navigate to saved lessons.
  6. Preferences Modal: Persist editor font size, theme, and keybindings via `/api/v1/users/preferences`.
  7. Playground Snippets: "Share Snippet" modal creating permalinks (`/playground/:slug`) and "Fork Snippet" action.
- **Deliverables**: Fully integrated user account and cloud persistence workflow.
- **Dependencies**: Phase 2, Phase 3, Phase 4.
- **Acceptance Criteria**: User modifies code, logs in, refreshes browser, and sees modified code restored from database.
- **Testing Requirements**: End-to-end integration tests for authentication lifecycle, cookie rotation, and payload size rejection.

---

### Phase 10: Testing & Quality Assurance
- **Objective**: Establish end-to-end testing, unit testing, and security verification across both frontend and backend.
- **Tasks**:
  1. Frontend Unit Tests (Vitest + React Testing Library): Test Monaco sync, Sandpack error overlay, and lesson tabs.
  2. Backend Unit & Slice Tests (JUnit 5 + MockMvc): Test controllers, security filters, JWT service, and database constraints.
  3. Security Verification:
     - Verify `HttpOnly` and `Secure` cookie attributes.
     - Verify CSRF defense rejects mutating requests lacking `X-Requested-With`.
     - Verify 512 KB JSON payload limit rejects oversize code bodies with HTTP 413.
     - Verify path traversal attempts (`/../test`) are rejected with HTTP 400.
     - Verify Sandpack cross-origin iframe prevents host cookie access.
- **Deliverables**: Automated test suite with passing CI reports.
- **Dependencies**: Phase 9.
- **Acceptance Criteria**: 100% of integration tests pass; security assertions verified.
- **Testing Requirements**: Automated execution via `npm test` and `./mvnw test`.

---

### Phase 11: Performance & Accessibility
- **Objective**: Optimize web vitals, implement lazy-loading for Monaco/Sandpack, and achieve WCAG 2.1 AA accessibility compliance.
- **Tasks**:
  1. Code-splitting: Lazy-load Monaco Editor and Sandpack dependencies on route entry.
  2. Assets & bundle tuning: Ensure initial landing page bundle is under 200 KB gzipped.
  3. Accessibility audit: Screen reader labels, keyboard navigable file tabs (`Tab`, `Arrow` keys), focus indicators, color contrast.
  4. Responsive panel tuning: Drawer mode for tablet and mobile viewports.
- **Deliverables**: Production-optimized frontend build.
- **Dependencies**: Phase 4, Phase 9.
- **Acceptance Criteria**: Google Lighthouse performance and accessibility scores > 90.
- **Testing Requirements**: Axe accessibility test suite and Lighthouse CLI run.

---

### Phase 12: Deployment & Production Verification
- **Objective**: Deploy the full production stack to Neon (Database), Render (Spring Boot REST API), and Vercel (React SPA) with SSL, Vercel API rewrite proxy, and health checks.
- **Tasks**:
  1. **Neon PostgreSQL**: Provision production serverless database, verify connection string with `sslmode=require`.
  2. **Render Web Service**:
     - Connect GitHub repo, configure Java 21 build command `./mvnw clean package -DskipTests`.
     - Configure production environment variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`).
     - Verify health check `/actuator/health` and Swagger UI.
  3. **Vercel Frontend**:
     - Connect GitHub repo, set framework to Vite.
     - Configure `vercel.json` rewrites for SPA routing and API proxy (`/api/v1/*` -> Render URL).
     - Deploy and verify same-origin cookie transmission.
  4. **Post-Deployment Smoke Verification**:
     - Register new account on live production site.
     - Verify `Set-Cookie` directives in browser dev tools.
     - Run Query, Table, and Start lessons in live Sandpack runner.
     - Save a snippet and load it via shared public link.
- **Deliverables**: Live public URLs for frontend, backend, and Swagger UI.
- **Dependencies**: Phase 10, Phase 11.
- **Acceptance Criteria**: Live application functions without console errors, SSL valid across all services.
- **Testing Requirements**: Live smoke test suite executing against production domains.
