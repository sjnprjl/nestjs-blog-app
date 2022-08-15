import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // CORS setup
  app.enableCors();

  // App versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(3000);

  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    app.close();
    console.log('Http server closed.');

    // close database connection
    console.log('Closing database connection.');
    const dataSource: DataSource = app.get(DataSource);
    dataSource.destroy();
    console.log('Database connection closed.');
    process.exit(0);
  });
}
bootstrap();
