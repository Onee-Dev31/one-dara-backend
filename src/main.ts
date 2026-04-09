import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('One Dara API')
    .setDescription('ระบบจัดการข้อมูลนักแสดง One Dara')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  // Serve api-docs.html
  const httpAdapter = app.getHttpAdapter();
  const docsPath = join(process.cwd(), 'api-docs.html');
  if (existsSync(docsPath)) {
    httpAdapter.get('/api-docs', (_req: any, res: any) => {
      res.setHeader('Content-Type', 'text/html');
      res.send(readFileSync(docsPath, 'utf8'));
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI:   http://localhost:${port}/docs`);
  console.log(`API Docs:     http://localhost:${port}/api-docs`);
}
bootstrap();
