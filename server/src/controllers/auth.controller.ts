import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { LocalAuthGuard, RefreshTokenGuard, Protected, AuthUserMiddleware } from './middleware';
import AuthService from '@/auth.service';

const authService = new AuthService(); 

const AuthController = {
    register: async (req: Request, res: Response): Promise<void> => {
            const registerBodyDto = req.body;
            const user = await authService.register(registerBodyDto);
            const handledTokens = await authService.handleTokenGeneration(user);
            await authService.generateEmailVerification(user.email);

            const responseData = await authService.createResponseData(user, handledTokens);
            res.json(responseData);
    },

    login: async (req: Request, res: Response): Promise<void> => {
            const user = req.user;
            const handledTokens = await authService.handleTokenGeneration(user);
            const responseData = await authService.createResponseData(user, handledTokens);
            res.json(responseData);
    },

    verifyEmail: async (req: Request, res: Response): Promise<void> => {
            const token = req.body.emailToken;
            const result = await authService.verifyEmail(token);
            res.json(result);
    },

    sendEmailVerification: async (req: Request, res: Response): Promise<void> => {
            const email = req.body.email;
            const result = await authService.sendEmailVerificationRequest(email, null);
            res.json(result);
    },

    refreshToken: async (req: Request, res: Response): Promise<void> => {
            const user = req.user;
            const result = await authService.refreshToken(res, user);
            res.json(result);
    },

    me: async (req: Request, res: Response): Promise<void> => {
            const user = req.user;
            res.json(user);
    },

    forgotPassword: async (req: Request, res: Response): Promise<void> => {
            const email = req.body.email;
            const result = await authService.forgotPassword(email);
            res.json(result);
    },

    resetPassword: async (req: Request, res: Response): Promise<void> => {
            const resetPasswordDto = req.body;
            const result = await authService.resetPassword(resetPasswordDto);
            res.json(result);
    },

    logout: async (req: Request, res: Response): Promise<void> => {
            // Implement logout functionality
            res.json({ data: 'successfully removed' });
    }
};

export default AuthController;
