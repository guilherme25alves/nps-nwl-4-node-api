import { Request, Response } from 'express';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { getCustomRepository, Not, IsNull } from 'typeorm';


/*
     Regra de Negócio

     1 2 3 4 5 6 7 8 9 10 (Notas)

     Classificação
          - Detratores => 0 - 6
          - Passivos => 7 - 8 (Não considerados para cálculo de NPS) (Conta no número de Respondentes)
          - Promotores => 9 - 10

     Fórmula de cálculo de NPS => Métrica em porcentagem
     (Número de promotores - número de Detratores) / (Número de Repondentes) * 100
*/


class NpsController {   

     async execute(request: Request, response: Response) {
          const { survey_id } = request.params;

          const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

          const surveysUsers = await surveysUsersRepository.find({ 
               survey_id, 
               value: Not(IsNull()),
           }); 

          const detractor = surveysUsers.filter(
               (survey) => survey.value >= 0 && survey.value <= 6
          ).length;
          
          const promoters = surveysUsers.filter(
               (survey) => survey.value >= 9 && survey.value <= 10
          ).length;

          const passive = surveysUsers.filter(
               (survey) => survey.value >= 7 && survey.value <= 8
          ).length;

          const totalAnswers = surveysUsers.length;

          const calculate = ((promoters - detractor) / totalAnswers) * 100;

          return response.json({
               detractor, 
               promoters, 
               passive,
               totalAnswers,
               nps: Number(calculate.toFixed(2)),
          });
     }     

}

export { NpsController };