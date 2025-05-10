

//register a new user
import { CheckOtpRestriction, validateRegisterationData } from "../utils/auth.helper";
import { Response , Request , NextFunction } from "express";
import { prisma } from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";
ValidationError

export const userRegisteration = async(req: Request, res: Response, next: NextFunction) => {
    validateRegisterationData(req.body,"user");
    const {name,email}=req.body;



    const exitingUser = await prisma.users.findUnique({
        where:{
            email:email
        }
    });
    if(exitingUser){
        return next (new ValidationError("User already exists"));
    }

    await CheckOtpRestriction(email,next);

}