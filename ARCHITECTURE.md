# Architecture Decision Record

## How to Use This File

1. **Current Architecture**: Documents the existing system design, patterns, and decisions
2. **Changes**: Records all architectural modifications with date, description, reason, and impact
3. **Planned Changes**: Tracks upcoming architectural decisions pending implementation
4. **Sections**: This file is implemented in sections or parts, keep the architectural decision in its own part.

**Note**: Claude Code will reference this file to understand the current architecture but will NOT automatically add entries. All entries must be added manually by the developer.

## Current Architecture

### Technology Stack
- **Framework**: NestJS (TypeScript)
- **Runtime**: Node.js
- **Package Manager**: pnpm
- **Tools**: docker (for local development)

### Project Structure
```
src/
  main.ts           - Application entry point
  app.module.ts     - Root module
  app.controller.ts - Root controller
  app.service.ts    - Root service
```

### Development
- docker local postgres container is used for fast local development
- supabase is used for production database
---

## Changes

---

## Planned Architectural Changes

_No planned changes yet_

---


