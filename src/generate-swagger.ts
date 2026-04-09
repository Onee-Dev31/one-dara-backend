import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('One Dara API')
    .setDescription('ระบบจัดการข้อมูลนักแสดง One Dara')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./swagger.json', JSON.stringify(document, null, 2), 'utf8');
  console.log('swagger.json generated successfully');

  await app.close();
}

generate();
