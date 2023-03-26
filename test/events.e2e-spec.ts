import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'supertest';
import { Connection, DataSource } from "typeorm";
import { AppModule } from "./../src/app.module";

describe('Events (e2e)', () => {
  let app: INestApplication;
  let datasource: DataSource;
  let connection: Connection;

  const loadFixtures = async (sqlFilename: string) => {
    const sql = fs.readFileSync(path.join(__dirname, 'fixtures', sqlFilename), 'utf8');

    // const queryRunner = datasource.createQueryRunner('master');
    const queryRunner = connection.driver.createQueryRunner('master');

    for (const statement of sql.split(';')) {
      if (statement.trim()) {
        await queryRunner.query(statement);
      }
    }
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    datasource = app.get(DataSource);
    connection = app.get(Connection);
  });

  // Make sure to close the app after all tests are done
  afterAll(async () => {
    await app.close();
  });


  it('should return empty list of events', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .then(response => {
        expect(response.body.data.length).toBe(0);
      });
  });

  it('should return a single event', async () => {
    await loadFixtures('1-event-1-user.sql');

    return request(app.getHttpServer())
      .get('/events/1')
      .expect(200);
  });
});