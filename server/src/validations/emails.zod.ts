import { z } from 'zod';

const createEmailVerificationBody = z.object({
    email: z.string().email(),
    emailToken: z.string(),
    timestamp: z.date(),
});
export {  createEmailVerificationBody };