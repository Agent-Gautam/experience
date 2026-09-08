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
- **Tools**: docker (for local development), TypeORM

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
- @nestjs/config is used to configure environment variables. there are two env files used - env.development and env.production. during production synchronize is false
- in production envrionment supabase is used whereas in development environment docker postgres is used.
- every development related script first run docker engine using docker-start.ps1 script

### Task
- timedness of task defines time associated with task either to do the task on a specific time or must be done before specific time.
- timednessValue is ensured to only exist if timedness has any value
- status.Scheduled tells that the task is scheduled currently, timedness.Scheduled tells that the task must be done at specific time, task.scheduled tells the actual scheduled time of task
- any task regardless of timedness.scheduled can be scheduled by the app or coming features.
- createdAt and updatedAt are not included in the dto because they are internally managed by typeorm.
- indices exist at status and scheduledAt for now.

### Goal
- goal is unique by name and priority
- a goal can be active, paused or planned
- default duration per task helps users easily create task with default time set per goal
- if progress tracking is enabled, users is often asks for checkpoints they reach at, which is yet to plan
- a goal is an entity attached with a task which helps groups or categorize similar tasks and helps in progress tracking.
- priority is decreasing with numbers, 1 means highest priority and then it decreases.
- priority is completely user provided, however, new task always has lowest priority
---

## Changes

---

## Planned Architectural Changes

- while creating a goal, lowest priority of all goals (highest number of priority) is fetched first, then the new goal is assigned the next number automatically, user can not enter any number of its choice
- user is able to change the priority of task after its creation but within only the numbers already assigned in priority
- body parser filter - it checks syntax errors in json and empty bodies sent especially not catched during update events

---


