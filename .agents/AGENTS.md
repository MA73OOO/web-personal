# Agent Context & Operating Guidelines — Personal Web (`MA73OOO/web-personal`)

Welcome agent! This document contains the context, architectural rules, and project standards for the **Personal Web** repository.

---

## 1. Project Overview & Architecture
* **Type:** Personal Showcase & Portfolio Web Application (SPA).
* **Target Stack:**
  * **Frontend:** Next.js (App Router, Static Export `output: 'export'`), Tailwind CSS / Vanilla CSS, TypeScript.
  * **Content Store:** Git-based JSON and Markdown files (no external database server).
  * **Hosting & Delivery:** AWS S3 Bucket (Static Site Hosting) + AWS CloudFront (CDN) + AWS Route53 (DNS / SSL).
  * **Infrastructure as Code (IaC):** Terraform.
  * **CI/CD:** GitHub Actions (Automated `next build` & sync `out/` to S3 + CloudFront cache invalidation).

---

## 2. Repository Layout Conventions
```text
web-personal/
├── .agents/                    # Agent rules and context definitions
│   ├── AGENTS.md               # Main general entrypoint for AI agents
│   ├── gemini/                 # Context and rules for Gemini / Antigravity
│   │   └── AGENTS.md
│   ├── claude/                 # Reserved for Claude context
│   ├── openai/                 # Reserved for OpenAI context
│   └── cursor/                 # Reserved for Cursor context
├── docs/                       # Project documentation & Architecture Decision Records (ADRs)
│   ├── 01-architecture-overview.md
│   ├── 02-project-roadmap.md
│   └── 03-harnesses-and-automation.md
├── harness/                    # Developer & Git harness automation tools
│   ├── README.md
│   ├── validate-build.js
│   ├── check-env.ps1
│   └── git-prep.ps1
├── terraform/                  # AWS Infrastructure modules & environments
├── src/                        # React SPA source code
│   ├── assets/                 # Images, icons, static documents
│   ├── components/             # Reusable UI components
│   ├── content/                # Content files (JSON/Markdown for projects, Figma links, articles)
│   ├── hooks/                  # Custom React hooks
│   └── styles/                 # Design tokens and styles
└── README.md
```

---

## 3. Key Technical Principles
1. **Zero-Backend / Git-Ops Content:** All showcase items (Figma designs, Colabb project highlights, LinkedIn references, articles) are managed as typed JSON/Markdown schema files inside `src/content/`.
2. **IaC First:** Infrastructure changes MUST be declared in `terraform/`. No manual AWS Web Console edits.
3. **Design Excellence:**
   * Modern typography (Google Fonts: Inter, Outfit, or Space Grotesk).
   * Sleek dark mode / high-contrast themes.
   * Micro-interactions, subtle hover states, and smooth CSS transitions.
4. **Documentation Discipline:**
   * Every major decision or new phase must be logged in `docs/`.

---

## 4. Workflow Rules
* Always update relevant documentation in `docs/` when introducing architectural changes.
* Maintain clean component separation in `src/components/`.
