# Claude Code Project Configuration

## Project Overview

This is a NestJS-based backend application following clean architecture principles and TypeScript best practices.

## Development Workflow

### Feature Development
1. **Plan First**: Use `ecc:planner` agent for complex features
2. **TDD Approach**: Use `ecc:tdd-guide` agent - write tests first
3. **Code Review**: Use `ecc:code-reviewer` and `ecc:typescript-reviewer` agents after writing code
4. **Security Review**: Use `ecc:security-reviewer` for auth, data handling, and API endpoints

### Build & Error Resolution
- **Build Errors**: Automatically use `ecc:build-error-resolver` when builds fail
- **TypeScript Errors**: PostToolUse hooks run `tsc` after editing `.ts`/`.tsx` files

### Testing Requirements
- **Minimum Coverage**: 80%
- **Test Types**: Unit, Integration, E2E (using Playwright via `ecc:e2e-runner`)
- **Framework**: Jest for unit/integration tests

## NestJS Best Practices

### Architecture
- Follow modular architecture - one module per domain feature
- Use dependency injection throughout
- Implement repository pattern for data access
- Keep controllers thin - delegate business logic to services
- Use DTOs with class-validator for input validation
- Implement proper error handling with exception filters

### Module Structure
```
src/
  modules/
    <feature>/
      dto/
      entities/
      repositories/
      services/
      controllers/
      <feature>.module.ts
```

### Code Organization
- **Controllers**: Handle HTTP requests, validation, response formatting
- **Services**: Business logic, orchestration
- **Repositories**: Data access layer
- **DTOs**: Input validation and transformation
- **Entities**: Database models
- **Guards**: Authentication and authorization
- **Interceptors**: Cross-cutting concerns (logging, transformation)
- **Pipes**: Data transformation and validation
- **Filters**: Exception handling

### Validation
- Use `class-validator` decorators in DTOs
- Apply `ValidationPipe` globally
- Validate all incoming data at API boundaries

### Error Handling
- Use built-in HttpException classes
- Implement custom exception filters for consistent error responses
- Never expose internal error details to clients

### Security
- Never hardcode secrets - use ConfigModule with .env
- Implement authentication guards (JWT recommended)
- Use CORS configuration
- Rate limiting on all public endpoints
- Helmet for security headers
- Input validation on all endpoints

## Available Skills

### Proactive Usage (Use Immediately)
- `ecc:planner` - Complex features and refactoring
- `ecc:tdd-guide` - New features and bug fixes (write tests first)
- `ecc:code-reviewer` - After writing any code
- `ecc:typescript-reviewer` - TypeScript-specific review
- `ecc:security-reviewer` - Auth, data handling, API endpoints
- `ecc:architect` - Architectural decisions
- `ecc:database-reviewer` - SQL queries, schema design, migrations

### On-Demand Skills
- `ecc:build-error-resolver` - Build failures
- `ecc:e2e-runner` - E2E test generation and execution
- `ecc:refactor-cleaner` - Dead code cleanup
- `ecc:doc-updater` - Documentation updates
- `ecc:performance-optimizer` - Performance bottlenecks

### Code Quality Gates
Before any commit:
1. All tests passing (80%+ coverage)
2. `ecc:code-reviewer` approval
3. `ecc:security-reviewer` for sensitive code
4. No console.log statements
5. TypeScript compilation clean

## Git Workflow

### Commit Format
```
<type>: <description>

<optional body>
```
Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

### Branch Strategy
- Always create feature branches from `main`
- Never commit directly to `main`
- Use `gh pr create` for pull requests after pushing with `-u` flag

### Pre-Commit Checklist
- [ ] No hardcoded secrets
- [ ] All tests passing
- [ ] 80%+ test coverage
- [ ] Build succeeds
- [ ] Code reviewed by agents
- [ ] No console.log statements

## Environment Setup

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Build for production
npm run build
```

## Configuration

- Environment variables in `.env` (never commit this file)
- ConfigModule loads from `.env` automatically
- Validate required env vars at startup

## Documentation

See `ARCHITECTURE.md` for architectural decisions and `PROGRESS.md` for development history.
