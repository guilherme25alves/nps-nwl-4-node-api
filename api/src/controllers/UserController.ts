import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';

class UserController {

     async create(request:Request , response:Response) {
          const { name, email } = request.body;
          
          // Usando YUP para validação
          // Scopo de objeto e validação           
          const schema = yup.object().shape({
               name: yup.string().required("Nome é obrigatório"),
               email: yup.string().email("Email inválido").required("Email é obrigatório")
          });

          // Primeira forma
          // if(!(await schema.isValid(request.body))) {
          //      return response.status(400).json({ 
          //           error: "Validation failed", 
          //      });
          // }

          // Segunda Forma 
          try {
               await schema.validate(request.body, { abortEarly: false}); // habilita todos os erros
          } catch (err) {
               // Mostra a lista de Erros que aconteceram
               return response.status(400).json({ 
                    error: err, 
               });
          }

          const usersRepository = getCustomRepository(UsersRepository);
          
          const userAlreadyExists = await usersRepository.findOne({
               email
          });

          if(userAlreadyExists) {
               return response.status(400).json({ error: 'User already exists!', });
          }

          // Temos que criar o usuário pelo Repositório, se tentarmos usar o método save diretamente, não vamos obter sucesso!
          const user = usersRepository.create({
               name, 
               email 
          });

          await usersRepository.save(user);

          return response.status(201).json(user);
     }
}

export { UserController };
