import { Repository, EntityRepository } from "typeorm";
import { User } from "../models/User";

@EntityRepository(User)
class UsersRepository extends Repository<User> { // Importação da classe Repository, para herdar os métodos nela disponíveis para acesso a banco

}

export { UsersRepository } 