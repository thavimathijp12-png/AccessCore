# Contributing to AccessCore

## Development Setup
- **Frontend**: Node.js 20+, `npm install`, `npm run dev`
- **Backend**: Java 17 (Temurin JDK 17), Apache Maven 3.9+, `mvn test` in `backend/`

## Branch & Commit Guidelines
1. Branch from the latest `main` using descriptive prefixes (`feat/`, `fix/`, `refactor/`, `test/`, `docs/`, `chore/`).
2. Keep frontend UI/UX unchanged unless explicitly requested.
3. Run `mvn test` in `backend/` before pushing backend changes.
4. Use conventional commit messages (e.g., `feat(auth): ...`, `test(entity): ...`).
