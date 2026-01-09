# Contributing to Flash Chat

We welcome contributions to Flash Chat! Please follow these guidelines to ensure a smooth collaboration.

## Branching Strategy

We use a simplified Feature Branch workflow:

1.  **main**: The production-ready branch. Do not push directly to main.
2.  **Feature Branches**: Create a new branch for each feature or bugfix.
    - Naming convention: `feature/your-feature-name` or `fix/your-bug-fix`.

## Development Workflow

1.  Clone the repository.
2.  Install dependencies: `bun install`.
3.  Create a new branch: `git checkout -b feature/my-feature`.
4.  Make your changes.
5.  Run tests: `bun test`.
6.  Lint your code: `bun run lint`.
7.  Commit your changes using Semantic Commit Messages (see below).
8.  Push to your branch and open a Pull Request.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat: add voice message support`

## Quality Standards

- **Tests**: All new logic must be tested. Existing tests must pass.
- **Linting**: Code must pass ESLint checks (`bun run lint`).
- **Code Review**: All PRs require review before merging.

## Release Process

Releases are managed via Semantic Versioning.
- Patch releases (1.0.x): `bun run release`
- Minor releases (1.x.0): `bun run release:minor`
- Major releases (x.0.0): `bun run release:major`
