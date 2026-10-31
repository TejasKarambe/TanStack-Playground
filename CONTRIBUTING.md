# Contributing to TanStack Playground

Thank you for your interest in contributing to **TanStack Playground**! This document outlines our engineering standards, local environment setup, testing requirements, and contribution workflows.

---

## 1. Prerequisites

Ensure you have the following installed on your development machine:
* **Node.js**: v20.x or v22.x LTS (tested up to v24.x)
* **npm**: v10.x or higher
* **Java Development Kit (JDK)**: JDK 21 or higher (Eclipse Temurin recommended)
* **Git**: v2.40+

---

## 2. Local Environment Setup

### 2.1 Clone Repository
```bash
git clone https://github.com/YourUsername/TanStack-Playground.git
cd TanStack-Playground
```

### 2.2 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server will launch at `http://localhost:5173`.
* By default, Vite proxies `/api` calls to `http://localhost:8080`.
* If you want to connect to a deployed backend or custom port, set `VITE_API_BASE_URL` in `frontend/.env`.

### 2.3 Backend Setup (Spring Boot)
Open a separate terminal:
```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run
# macOS / Linux:
./mvnw spring-boot:run
```
The backend starts on `http://localhost:8080`:
* Uses Spring profile `dev` by default.
* Spawns an in-memory PostgreSQL-compatible H2 database.
* Seeds default demo developer credentials (`demo@tanstack.dev` / `password123`) and curriculum metadata.
* Exposes `/actuator/health` and Swagger UI at `http://localhost:8080/swagger-ui.html`.

---

## 3. Architecture & Guidelines

Before proposing major changes, review the architecture specifications in [`docs/`](docs/):
* [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): System topology and component boundaries.
* [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md): REST API endpoints and data contracts.
* [`docs/LESSON_AUTHORING.md`](docs/LESSON_AUTHORING.md): Guide for writing and registering curriculum modules.
* [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Deployment instructions for Neon, Render, and Vercel.

### Key Architectural Invariants:
1. **No Backend Arbitrary Code Execution**: All user-edited code runs strictly client-side inside the Sandpack iframe. The Spring Boot backend must never compile or execute user JavaScript.
2. **Never Commit Secrets**: Database passwords, private keys, and JWT secrets must strictly use environment variables.
3. **Interactive Simulation Controls**: Do not add decorative controls; controls must genuinely alter the code or network state in the example.

---

## 4. Development Workflow

### 4.1 Branching Strategy
* `main`: Protected production branch.
* Feature branches: `feat/<feature-name>` (e.g. `feat/tanstack-pacer-lessons`)
* Fix branches: `fix/<issue-description>` (e.g. `fix/monaco-resize-glitch`)
* Documentation: `docs/<topic>` (e.g. `docs/update-api-contracts`)

### 4.2 Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
* `feat(query): add query cancellation interactive lesson`
* `fix(editor): resolve Monaco auto-recompile debounce state`
* `docs(deployment): add Neon connection pooling notes`
* `test(auth): add register and login test coverage`

---

## 5. Verification & Testing Standards

All pull requests must pass frontend and backend checks prior to merging.

### 5.1 Frontend Verification
```bash
cd frontend

# 1. Run Vitest Unit Tests
npm run test

# 2. Run TypeScript Compilation & Production Build
npm run build

# 3. Run Linter
npm run lint
```

### 5.2 Backend Verification
```bash
cd backend

# Windows:
.\mvnw.cmd clean test
# macOS / Linux:
./mvnw clean test
```

---

## 6. Submitting a Pull Request (PR)

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/my-new-feature
   ```
2. Open a Pull Request against `main`.
3. Fill out the PR template with:
   * Description of changes.
   * Linked issue(s).
   * Screenshots / video recordings for UI changes.
   * Confirmation of tests passing locally.
4. Address review feedback constructively. Once approved, commits are squash-merged into `main`.

---

## 7. Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful, constructive, and collaborative.

