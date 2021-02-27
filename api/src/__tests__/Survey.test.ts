import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';
import { getConnection } from 'typeorm';

describe("Surveys", async () => {

     beforeAll(async () => {
          const connection = await createConnection();
          await connection.runMigrations();
     });

     // Forma de dropar o banco, sem precisar configurar script no package.json após os testes
     afterAll( async () => {
          const connection = getConnection();
          await connection.dropDatabase();
          await connection.close();
     });

     it("Should be able to create a new survey", async () => {
          const response =  await request(app).post("/surveys").send({
               title: "Title Example",
               name: "Description Example"
          });

          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty("id");
     });

     it("Should be able to get all surveys", async () => {
          await request(app).post("/surveys").send({
               title: "Title Example2",
               name: "Description Example2"
          });

          const response = await request(app).get("/surveys");

          expect(response.body.length).toBe(2);
     });

});

