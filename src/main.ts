import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  const config = new DocumentBuilder()
    .setTitle('Experience API')
    .setDescription('API documentation for the Experience backend')
    .setVersion('1.0')
    .addTag('experience')
    .build();
  
  const document = SwaggerModule.createDocument(app, config, {
    // Enable automatic conversion of class-validator decorators to Swagger annotations
    deepScanRoutes: true,

  });

  SwaggerModule.setup('api-json', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  await app.listen(process.env.PORT ?? 8000);
}
await bootstrap();
