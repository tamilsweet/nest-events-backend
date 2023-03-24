import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";
import * as request from 'supertest';

describe('Events (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Make sure to close the app after all tests are done
  afterAll(async () => {
    await app.close();
  });


  it('/events (GET)', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200);
  });
});