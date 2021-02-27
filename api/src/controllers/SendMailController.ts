import { Request, Response } from 'express';
import { resolve } from 'path'; // Lib para facilitar mapeamento de elementos no nosso projeto
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailService from '../services/SendMailService';


class SendMailController {

     async execute( request: Request, response: Response) {
          const { email, survey_id } = request.body;

          const usersRepository = getCustomRepository(UsersRepository);
          const surveysRepository = getCustomRepository(SurveysRepository);
          const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

          const userAlreadyExists = await usersRepository.findOne({email});

          if(!userAlreadyExists) {
               return response.status(400).json({
                    error: "User does not exist",
               });
          }

          const surveyAlreadyExists = await surveysRepository.findOne({ id: survey_id}); // Propriedade ID , valor SURVEY_ID

          if(!surveyAlreadyExists) {
               return response.status(400).json({
                    error: "Survey does not exist",
               });
          }

           // Pelo fato de importamos com => export default new SendMailService => Podemos usar da forma abaixo
           const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");                     

          const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
               where: { user_id: userAlreadyExists.id , value: null },
               relations: ["user", "survey"] // Forma de recuperar o objeto completo, com o relacionamento, através do mapeamento nas Models
          });

          const variables = {
               name: userAlreadyExists.name,
               title: surveyAlreadyExists.title,
               description: surveyAlreadyExists.description,
               id: "",
               link: process.env.URL_MAIL
          };

          if(surveyUserAlreadyExists) {
               variables.id = surveyUserAlreadyExists.id;
               await SendMailService.execute(
                    email, 
                    surveyAlreadyExists.title,
                    variables,
                    npsPath
               );

               return response.json(surveysUsersRepository);
          }

          // Salvar informações na table SurveysUsers || Enviar E-mail para o usuário 
           const surveyUser = surveysUsersRepository.create({
                user_id: userAlreadyExists.id,
                survey_id 
           })
           await surveysUsersRepository.save(surveyUser);          

           variables.id = surveyUser.id;

           await SendMailService.execute(
                email, 
                surveyAlreadyExists.title,
                variables,
                npsPath 
          );

           return response.json(surveyUser);
     }
}

export { SendMailController }