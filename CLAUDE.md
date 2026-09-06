# Claude Code Project Configuration

## Project Overview

This is a NestJS-based backend application following clean architecture principles and TypeScript best practices.

## NestJS Best Practices

### Architecture

- Follow modular architecture - one module per domain feature
- Use dependency injection throughout
- Implement repository pattern for data access
- Keep controllers thin - delegate business logic to services
- Use DTOs with class-validator for input validation
- Implement proper error handling with exception filters

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

## Documentation

See `ARCHITECTURE.md` for architectural decisions and `PROGRESS.md` for development history.

## Instructions

- Never search, glob, or read inside `node_modules/`, `dist/`, or `.git/` directories.
- use pnpm instead of npm
- you dont' need to take any action like downloading packages, unless asked
- this project is being built and run on windows, so act accordingly
- don't write explanatory but collaborative comments where it is truly necessary