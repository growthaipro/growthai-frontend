import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('Worker');
  const app = await NestFactory.create(WorkerModule);

  await app.listen(3002);
  logger.log('⚙️  Worker process running on port 3002');
  logger.log('📡 Listening to queues: metrics, campaign, optimization, creative');
}

bootstrap();
