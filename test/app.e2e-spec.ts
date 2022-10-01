import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Test } from '@nestjs/testing';

describe('App (e2e)', () => {

  let app: INestApplication;
  beforeAll(async () => {
    const appModuleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = appModuleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));

    await app.init();
  });

  afterAll(async () => {
    await app.close()
  });

  it.todo("it should work")
});