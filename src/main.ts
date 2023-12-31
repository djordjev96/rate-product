import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 3000, () => {
    console.log(
      'Listening on port ',
      configService.get('PORT') ? configService.get('PORT') : 3000,
    );
  });
}
bootstrap();
