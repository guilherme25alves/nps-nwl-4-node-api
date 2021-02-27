import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { AppError } from '../errors/AppErrors';

class AnswerController {

     async execute(request: Request, response: Response) {

          console.log('TESTE');

          const { value } = request.params;
          const { u } = request.query;

          const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

          const surveyUser = await surveysUsersRepository.findOne({
               id: String(u)
          });

          if(!surveyUser) {
               // Usando Classe customizada para geração de Exception e tratamento de erros
               throw new AppError("Survey User does not exist");
               
               // Forma de Tratamento de Erro
               // return response.status(400).json({
               //      error: "Survey User does not exist",
               // });
          }

          surveyUser.value = Number(value);

          await surveysUsersRepository.save(surveyUser);

          return response.json(surveyUser);
     }
}

export { AnswerController }
