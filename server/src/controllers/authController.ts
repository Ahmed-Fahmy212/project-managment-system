import { RegisterBodySchema } from "../types/auth.zod"
import { AuthService } from "../services";


const AuthController ={
    Registe : async (req: Request, res: Response): Promise<void> => {
        const validatedData = RegisterBodySchema.parse(req.body);
        const user = await AuthService.register(validatedData);
        

    }
    ,
} 