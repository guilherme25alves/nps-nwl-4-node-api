export class AppError {
     public readonly message: string;
     public readonly statusCode: number; // Public readonly porque o Constructor que fica responsável por settar os valores

     constructor(message: string, statusCode = 400) {
          this.message = message;
          this.statusCode = statusCode;
     }
}