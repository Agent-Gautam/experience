# Integrating Swagger (OpenAPI) in NestJS

This guide walks you through adding Swagger to your NestJS project so that the API specification is automatically generated and available at `/api-json`. We'll leverage `class-validator` decorators to avoid manually writing `@ApiProperty` on every DTO field.

---

## Table of Contents
1. [Install Required Packages](#1-install-required-packages)
2. [Configure Swagger in `main.ts`](#2-configure-swagger-in-maints)
3. [Enable Automatic DTO Metadata Extraction](#3-enable-automatic-dto-metadata-extraction)
4. [Customize Swagger Document (Optional)](#4-customize-swagger-document-optional)
5. [Verify the Setup](#5-verify-the-setup)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Install Required Packages

Run the following command in your project root:

```bash
pnpm add @nestjs/swagger swagger-ui-express
```

- `@nestjs/swagger` – NestJS module for Swagger/OpenAPI integration.
- `swagger-ui-express` – Serves the Swagger UI (optional but recommended for viewing the spec).

> **Note:** You already have `class-validator` and `class-transformer` as dependencies, which we will use for automatic metadata extraction.

---

## 2. Configure Swagger in `main.ts`

Open `src/main.ts` and modify the bootstrap function as shown below:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Existing validation pipe (keep as is)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ----------------- Swagger Setup -----------------
  const config = new DocumentBuilder()
    .setTitle('Experience API')
    .setDescription('API documentation for the Experience backend')
    .setVersion('1.0')
    .addTag('experience')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // This enables extraction of DTO metadata from class-validator/decorators
    extraModels: [], // you can add additional models here if needed
    deepScanRoutes: true,
  });

  // Serve Swagger UI at /api-json
  SwaggerModule.setup('api-json', app, document, {
    // Optional: customize Swagger UI options
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  // ------------------------------------------------

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
```

### What this does:
- Creates a Swagger document with basic metadata (title, description, version, tag).
- Uses `SwaggerModule.createDocument` with `extraModels` and `deepScanRoutes` to scan your controllers and DTOs.
- Mounts the Swagger UI at the path `/api-json` (e.g., `http://localhost:8000/api-json`).

---

## 3. Enable Automatic DTO Metadata Extraction

To avoid writing `@ApiProperty` on every DTO field, we rely on the `class-validator` decorators (e.g., `@IsString()`, `@IsInt()`, `@IsOptional()`, etc.) being automatically converted to OpenAPI properties.

### Ensure your DTOs use `class-validator` decorators

Example DTO (`src/task/dto/create-task.dto.ts`):

```ts
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskTimedness } from '../enums/task-timedness.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskTimedness)
  @IsOptional()
  timedness?: TaskTimedness;
}
```

> With the `@nestjs/swagger` module and the `createDocument` call above, NestJS will automatically infer:
> - Property type (`string`, `number`, `enum`, etc.) from the decorator and TypeScript type.
> - Whether the property is required (`@IsNotEmpty` or absence of `@IsOptional`).
> - Enum values from `IsEnum`.
> - Default values, min/max length, etc., if you add decorators like `@MinLength`, `@MaxLength`, `@IsInt({ min: 0, max: 100 })`, etc.

### No need to add `@ApiProperty` unless you want to override something
If you need to customize the description, add an example, or change the property name in the spec, you can still add `@ApiProperty()` selectively. But for most cases, the validator decorators are sufficient.

---

## 4. Customize Swagger Document (Optional)

You can further tailor the generated OpenAPI document:

### Add a global prefix
If your app uses a global prefix (e.g., `/api`), reflect it in Swagger:

```ts
const config = new DocumentBuilder()
  .setTitle('Experience API')
  .setDescription('API documentation for the Experience backend')
  .setVersion('1.0')
  .addTag('experience')
  .addServer('/api') // <-- informs Swagger UI that endpoints are under /api
  .build();
```

### Add security (e.g., JWT)
If you have JWT authentication:

```ts
config.addBearerAuth(
  { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
  'access-token',
);
```

Then apply the `@ApiBearerAuth()` decorator to controllers or methods that require auth.

### Include additional models
If you have interfaces or types not directly used in controller signatures but you want them in the spec (e.g., for reusable components), list them in `extraModels`:

```ts
const document = SwaggerModule.createDocument(app, config, {
  extraModels: [SomeInterface, AnotherType],
  deepScanRoutes: true,
});
```

---

## 5. Verify the Setup

1. Start your application in development mode:
   ```bash
   pnpm run start:dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:8000/api-json
   ```
   You should see the Swagger UI with your endpoints listed.
3. Click on any endpoint to view the automatically generated request/response schemas.
4. Try the "Try it out" feature to ensure the spec matches the actual implementation.

---

## 6. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Swagger page shows `Cannot GET /api-json` | Route not mounted; check `main.ts` for typos in `SwaggerModule.setup('api-json', ...)` | Ensure the path matches exactly and the server is restarted after changes. |
| Empty schemas or missing fields | DTOs lack `class-validator` decorators or NestJS cannot scan them | Add proper validator decorators; verify `deepScanRoutes: true` is set. |
| 404 on API endpoints after adding Swagger | Swagger UI might be intercepting all routes | Change the Swagger path to something less generic (e.g., `/docs`) or ensure it’s placed **before** any wildcard routes (unlikely in NestJS). |
| `tsc` errors about missing `@nestjs/swagger` | Package not installed or TypeScript not restarted | Run `pnpm install` again and restart the dev server. |

---

## Summary

You now have Swagger configured:
- **Endpoint:** `/api-json` (Serves Swagger UI)
- **Auto‑generated specs** from controllers + DTOs using `class-validator` decorators → no manual `@ApiProperty` required unless you need overrides.
- **Customizable** via `DocumentBuilder` and `SwaggerModule.options`.

Feel free to ask if you need help adapting this to a specific module or adding authentication details.

Happy coding! 🚀