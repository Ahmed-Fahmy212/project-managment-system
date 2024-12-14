import prisma from '../../prisma/client';
import { IFilterEmailVerification } from '../interfaces/email-interfaces';
import { createEmailVerificationBody } from '../validations/emails.zod';
import zod from 'zod';

export const EmailVerificationService = {
    getEmailVerificationData: async (payload: IFilterEmailVerification) => {
        const result = await prisma.emailVerification.findFirst({
            where: { email: payload.email },
        });
        console.log('payload', payload);
        return result;
    },

    createEmailVerification: async (payload: zod.infer<typeof createEmailVerificationBody>) => {
        const result = await prisma.emailVerification.create({
            data: payload,
        });
        return result;
    },

    deleteForgottenPasswordTokenById: async (id: string) => {
        const result = await prisma.emailVerification.delete({
            where: { id },
        });
        return result;
    }
};