# Contributing Guide

Thank you for your interest in contributing to the NVIDIA Super Computing Club website! This guide will help you get started.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [File Structure Conventions](#file-structure-conventions)

---

## Getting Started

1. **Find or Pick an Issue** — Browse [GitHub Issues](https://github.com/your-org/nvidia-sc-website/issues) filtered by your sprint label and `good first issue` or `help wanted`.
2. **Comment to Get Assigned** — Comment on the issue saying you'd like to work on it. A maintainer will assign you.
3. **Fork & Clone** — Fork the repo, then clone your fork.
4. **Create a Branch** — Use the branch naming convention below.
5. **Develop** — Build the feature or fix.
6. **Open a PR** — Push your branch and open a Pull Request.

---

## Development Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- Git

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/nvidia-sc-website.git
cd nvidia-sc-website

# Setup frontend
cd client
npm install
cp .env.example .env   # Fill in your MongoDB URI and env vars
npm run dev

# In a second terminal, setup backend
cd server
npm install
cp .env.example .env   # Fill in your env vars
node index.js
```

### Getting Test Credentials

Ask a maintainer for the shared `.env` values (MongoDB URI, JWT secret, OAuth credentials). Never commit real keys.

---

## Branch Naming

Use the format: `<type>/<short-description>`

| Type       | When to Use                       | Example                    |
| ---------- | --------------------------------- | -------------------------- |
| `feat/`    | New feature                       | `feat/landing-hero`        |
| `fix/`     | Bug fix                           | `fix/events-card-hover`    |
| `docs/`    | Documentation only                | `docs/api-reference`       |
| `style/`   | CSS / styling (no logic change)   | `style/footer-alignment`   |
| `refactor/`| Code restructure (no new feature) | `refactor/auth-middleware`  |
| `test/`    | Adding or updating tests          | `test/events-api`          |
| `chore/`   | Tooling, configs, dependencies    | `chore/update-vite`        |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Examples

```
feat(landing): add GSAP scroll animation to hero section
fix(auth): handle expired refresh token gracefully
docs(api): add events endpoint documentation
style(ui): fix button hover state on mobile
refactor(server): extract MongoDB connection to config/
```

### Rules

- Use imperative mood: "add" not "added"
- Keep subject line under 72 characters
- Reference the issue number in the body: `Closes #42`

---

## Pull Request Process

### Before Opening a PR

- [ ] All changes are committed with clear messages
- [ ] Code lints without errors (`npm run lint` in both client/ and server/)
- [ ] No console.log or debug statements left behind
- [ ] Tests pass (when tests are set up)
- [ ] Branch is up to date with `main`

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Closes #<issue-number>

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and the environments.

## Checklist
- [ ] My code follows the project's code style
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated documentation accordingly
- [ ] My changes generate no new warnings
```

### Review Process

1. At least **one approval** is required from a maintainer.
2. Address all review comments — push new commits (don't force-push during review).
3. Once approved and CI passes, the PR will be squash-merged.
4. Delete your feature branch after merge.

---

## Code Standards

### JavaScript / React

- Use **functional components** with hooks (no class components).
- Use **named exports** for components.
- Keep components under **150 lines** — extract sub-components if larger.
- Use **camelCase** for variables and functions.
- Use **PascalCase** for component files and names.
- Use **UPPER_SNAKE_CASE** for constants.

### CSS / Tailwind

- Use Tailwind utility classes — avoid custom CSS when possible.
- Custom CSS goes in `src/styles/` only when Tailwind can't handle it.
- Follow the design system tokens (see `docs/UI-DESIGN.md`).

### Backend

- Controllers handle HTTP — no business logic in controllers.
- Services contain business logic and Mongoose queries.
- Use **async/await** — no raw `.then()` chains.
- Always validate input before processing.

---

## File Structure Conventions

### Frontend Component

```
client/src/components/sections/HeroSection.jsx
client/src/components/ui/Button.jsx
client/src/components/3d/DGXModel.jsx
client/src/components/layout/Navbar.jsx
```

### Backend Route

```
server/routes/events.js       # Route definition
server/controllers/events.js  # Route handler
server/services/events.js     # Business logic
```

### Pages

```
client/src/pages/Home.jsx
client/src/pages/Events.jsx
client/src/pages/Team.jsx
client/src/pages/admin/Dashboard.jsx
client/src/pages/admin/EventsCMS.jsx
client/src/pages/admin/TeamCMS.jsx
```

---

## Questions?

Open a discussion on GitHub or reach out to the maintainers on Discord.
