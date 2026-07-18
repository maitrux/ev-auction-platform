import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser.default());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EV Auction API')
    .setDescription('API for the EV auction platform')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  const document = cleanupOpenApiDoc(
    SwaggerModule.createDocument(app, swaggerConfig),
  );
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  await app.listen(3001);
}

void bootstrap();
