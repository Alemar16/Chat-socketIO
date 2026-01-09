# Contributing to Flash Chat

We welcome contributions to Flash Chat! Please follow these guidelines to ensure a smooth collaboration.

## Branching Strategy

We use a standard **Git Flow** strategy:

1.  **main**: The production-ready branch. Only stable code resides here.
2.  **develop**: The integration branch. All features are merged here first for testing.
3.  **Feature Branches**: Create a new branch for each feature or bugfix.
    - Create from: `develop`
    - Merge into: `develop`
    - Naming convention: `feature/your-feature-name` or `fix/your-bug-fix`.

## Development Workflow

1.  Clone the repository.
2.  Switch to develop: `git checkout develop`
3.  Pull latest changes: `git pull origin develop`
4.  Create a new branch: `git checkout -b feature/my-feature`.
5.  Make your changes.
6.  Run tests: `bun test`.
7.  Lint your code: `bun run lint`.
8.  Commit your changes using Semantic Commit Messages.
9.  Push to your branch and open a Pull Request targeting **develop**.

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
