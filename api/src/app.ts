import 'reflect-metadata'; 
import express, { NextFunction } from 'express';
// Importar logo abaixo do Express => ExpressAsyncErrors
import "express-async-errors";
import { Request, Response } from 'express';
import createConnection from "./database";
import { router } from './routes';
import { AppError } from './errors/AppErrors';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

// Middleware para tratamento de Erros com Exceptions Lançadas
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
     if(err instanceof AppError) {
          return response.status(err.statusCode).json({
               message: err.message,
          });
     }

     return response.status(500).json({ 
          status: "Error",
          message : `Internal Server Error : ${ err.message }`,
     });
});

export { app }