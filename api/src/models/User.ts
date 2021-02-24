import { Entity, PrimaryColumn, CreateDateColumn, Column } from "typeorm";
import { v4 as uuid } from 'uuid'; // Possui v1, v2, etc.. (Delimita a forma que o ID é gerado)

@Entity("users")
class User {

     @PrimaryColumn()
     readonly id: string;

     @Column()
     name: string;

     @Column()
     email: string;

     @CreateDateColumn()
     created_at: Date;

     constructor() {
          if(!this.id) {
               this.id = uuid();
          }
     }
}

export { User }
