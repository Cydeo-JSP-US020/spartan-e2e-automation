# Spartan UI Automation Framework (Playwright + TypeScript)

An enterprise-grade, end-to-end UI automation testing framework built for the [Spartan Web Application](https://spartan-app-new-nonsecure.onrender.com/web/v2/spartans).

Built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern, following official Playwright standards and test automation best practices.

---

## 🏗️ Architecture & Directory Structure

```text
spartan-e2e-automation/
├── .agents/                          # Antigravity Multi-Agent System & Skills
│   ├── agents/                       # Specialized Sub-Agent Profiles
│   │   ├── planner.agent.md          # Requirements ingestion & 1-to-1 AC mapping
│   │   ├── explorer.agent.md         # Live DOM & Swagger REST exploration
│   │   ├── generator.agent.md        # Code synthesizer (specs, POM, services)
│   │   └── healer.agent.md           # 3-tier failure diagnosis & auto-healing
│   ├── skills/                       # Antigravity Skills & Workflows
│   │   ├── test-automation-lifecycle/# Master orchestrator & WORKFLOW.html
│   │   ├── pr-summary/               # Pull request generator via GitHub MCP
│   │   └── pr-reviewer/              # Automated code reviewer
│   └── mcp_config.json               # MCP integrations (Jira, Azure DevOps, Playwright)
│
├── .env                              # Local environment variables (URL, Headless, Timeouts)
├── .env.example                  # Template for environment configuration
├── .gitignore                    # Git ignore file for reports, caches, and node_modules
├── package.json                  # NPM dependencies and test execution scripts
├── playwright.config.ts          # Central Playwright configuration
├── tsconfig.json                 # TypeScript compiler configuration (ES2022 / NodeNext)
│
├── pages/                        # Page Object Model (POM) classes
│   ├── BasePage.ts               # Base page with common navigations, navbar, and footer
│   ├── HomePage.ts               # Home landing portal (/web/v2/home)
│   ├── SpartanListPage.ts        # Data table, filters, and row-level actions (/web/v2/spartans)
│   ├── AddSpartanPage.ts         # New Spartan creation form (/web/v2/spartans/add)
│   ├── EditSpartanPage.ts        # Spartan update form (/web/v2/spartans/edit/{id})
│   ├── SpartanDetailsPage.ts     # Read-only Spartan view (/web/v2/spartans/{id})
│   └── index.ts                  # Centralized page export barrel
│
├── services/                     # API Client Service Classes (Service Object Model)
│   ├── SpartanApiClient.ts       # Type-safe API client wrapping APIRequestContext
│   └── index.ts                  # Centralized services export barrel
│
├── fixtures/                     # Playwright Test Extension Fixtures
│   ├── pageFixtures.ts           # Unified POM & API client fixture dependency injection
│   └── index.ts                  # Fixtures barrel export
│
├── tests/                        # Playwright Test Specification Suites
│   ├── home.spec.ts              # UI: Home page navigation and branding tests
│   ├── spartan-list.spec.ts      # UI: Table structure, headers, and client-side filter tests
│   ├── spartan-validation.spec.ts# UI: Form field validation and error message tests
│   ├── spartan-crud.spec.ts      # UI: Complete End-to-End Create, Read, Update, Delete test
│   └── api/                      # REST API Test Suites
│       ├── spartan-api-crud.spec.ts        # API: CRUD lifecycle (POST, GET, PUT, PATCH, DELETE)
│       ├── spartan-api-search.spec.ts      # API: Query params (nameContains, gender, filtering)
│       └── spartan-api-validation.spec.ts  # API: 400 Bad Request & 404 Not Found validations
│
├── utilities/                    # Helper Classes & Utilities
│   ├── BrowserUtils.ts           # Wait helpers, scrolling, and table utility methods
│   ├── DataGenerator.ts          # Dynamic test data generator for test isolation
│   ├── EnvConfig.ts              # Type-safe environment configuration loader
│   └── index.ts                  # Centralized utility export barrel
│
└── test-data/                    # Test Data Contracts & Constants
    └── spartanData.ts            # Interfaces, enums, response wrappers, and message constants
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### 2. Installation
Install project dependencies and Playwright browsers:
```bash
npm install
npx playwright install chromium
```

---

## 🧪 Running Tests

### Available NPM Scripts

| Command | Description |
|---|---|
| `npm test` | Runs all UI and API tests using Chromium in headless mode |
| `npm run test:api` | Runs all API test suites |
| `npm run test:api:crud` | Runs the API CRUD & lifecycle test suite |
| `npm run test:api:search` | Runs the API search query test suite |
| `npm run test:api:validation` | Runs the API negative validation test suite |
| `npm run test:crud` | Runs the UI Spartan End-to-End CRUD test suite |
| `npm run test:validation` | Runs UI form validation test scenarios |
| `npm run test:list` | Runs UI table search and filter scenarios |
| `npm run test:all-browsers` | Runs tests across Chromium, Firefox, and WebKit |
| `npm run test:headed` | Runs Chromium tests in headed browser mode |
| `npm run test:ui` | Opens the interactive Playwright UI Test Runner |
| `npm run test:debug` | Runs tests with Playwright Inspector step-by-step debugger |
| `npm run report` | Opens the generated HTML test execution report |
| `npm run typecheck` | Validates TypeScript types without emitting JavaScript |

---

## 💡 Key Design Patterns & Standards

### 1. Unified Page Object Model & API Client Fixtures
In accordance with Playwright recommendations, tests do not manually instantiate page or client classes with `new Class()`. Instead, `fixtures/pageFixtures.ts` extends `@playwright/test`:

```typescript
import { test, expect } from '../fixtures';

// UI Test
test('create and delete spartan via UI', async ({ addSpartanPage, spartanListPage }) => {
  await addSpartanPage.goto();
  await addSpartanPage.createSpartan({ name: 'Leonidas', gender: 'Male', phone: '1234567890' });
  await expect(spartanListPage.filteredCountSpan).toBeVisible();
});

// API Test
test('create and delete spartan via REST API', async ({ spartanApiClient }) => {
  const response = await spartanApiClient.createSpartan({ name: 'Leonidas', gender: 'Male', phone: '1234567890' });
  expect(response.status()).toBe(201);
});
```

### 2. Service Object Model for REST APIs
The `SpartanApiClient` (`services/SpartanApiClient.ts`) encapsulates all HTTP operations (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and `search`) using Playwright's `APIRequestContext` with strongly-typed request and response contracts (`ResponseWrapper<T>`, `ExceptionWrapper`).

### 3. Test Data Isolation with Faker
Tests use the `DataGenerator` utility (`utilities/DataGenerator.ts`) powered by `@faker-js/faker` to dynamically generate realistic, gender-aligned Spartan names, valid 10-digit phone numbers (`^\d{10,13}$`), and invalid payloads for boundary testing, preventing flaky test collisions in shared environments.

### 4. Web-First Assertions & Auto-Waiting
All tests utilize Playwright web-first assertions (`await expect(locator).toHaveText()`, `await expect(locator).toBeVisible()`) ensuring resilience against asynchronous network delays without hardcoded sleeps.

---

## 🤖 Agentic Test Automation Framework (Antigravity CLI)

This framework is augmented with an **Autonomous Multi-Agent Architecture** powered by Google Antigravity CLI (`agy`) and the Model Context Protocol (MCP).

### 🌟 Master Orchestrator: `/test-automation-lifecycle`
When triggered with a Jira Issue Key (e.g. `/test-automation-lifecycle SPAR-101`) or Azure DevOps Work Item ID (e.g. `/test-automation-lifecycle 10423`), the orchestrator coordinates **4 specialized sub-agents** through an isolated git branch workflow:

```
[Target Ingestion] ➔ [Git Isolation] ➔ [Planner Agent] ➔ [Explorer Agent] ➔ [Generator Agent] ➔ [Test Run] ➔ [Healer Agent] ➔ [PR Summary]
```

### 👥 The 4 Specialized Sub-Agents
1. **Planner Agent (`.agents/agents/planner.agent.md`)**:
   - Ingests user story narrative and Acceptance Criteria (ACs) via Atlassian MCP or Azure DevOps MCP.
   - Enforces **1-to-1 AC-to-Test Mapping** (`AC1` ➔ `test('AC1: ...')`).
   - Conducts POM and API Service gap analysis to prevent code duplication.
2. **Explorer Agent (`.agents/agents/explorer.agent.md`)**:
   - Interacts with live Spartan Web App (`/web/v2/spartans`) and Swagger UI via Playwright MCP tools.
   - Audits DOM accessibility tree, validates user-facing locators (`getByRole`, etc.), and verifies API response schemas.
3. **Generator Agent (`.agents/agents/generator.agent.md`)**:
   - Synthesizes production-ready Playwright TypeScript specs using custom fixtures (`fixtures/pageFixtures.ts`).
   - Updates Page Objects in `pages/` and API endpoints in `services/SpartanApiClient.ts`.
   - Enforces web-first assertions and strict zero-hardcoded-sleeps policy.
4. **Healer Agent (`.agents/agents/healer.agent.md`)**:
   - Diagnoses test failures using a strict **3-Tier Taxonomy**:
     - `1. automation-code`: Autonomously patches Page Objects, services, or specs, and re-executes tests.
     - `2. environment data`: Halts healing and logs environment discrepancy report.
     - `3. product defect`: Halts healing and logs formal bug report with reproduction steps.

### 📊 Interactive Visual Workflow Dashboard
Open [.agents/skills/test-automation-lifecycle/WORKFLOW.html](.agents/skills/test-automation-lifecycle/WORKFLOW.html) in your browser for:
- 🔄 Interactive 9-Stage Flowchart with stage dossiers.
- 🤖 Sub-Agent Profiles, tools, and live prompt inspectors.
- 🔗 Jira & Azure DevOps MCP live story ingestion simulator.
- 📊 1-to-1 AC Traceability Matrix.
- 🩺 3-Tier Failure Taxonomy & Code Healing Simulator.
- 💻 Live Antigravity CLI Execution Runner.

### 🚀 Running the Agentic Workflow
Launch the Antigravity CLI in your project terminal:
```bash
agy
```
Trigger the master orchestrator with your target work item:
```text
agy> /test-automation-lifecycle SPAR-101
agy> /test-automation-lifecycle 10423
agy> /test-automation-lifecycle "Story: Filter Spartans by Gender. AC1: Male filter. AC2: Total count updates."
```


