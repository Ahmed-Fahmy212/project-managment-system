
import { UserService as usersService } from "./user.service";
import { LoginBodySchema, RegisterBodySchema, ResetPasswordSchema, VerifyEmailSchema } from "../types/auth.zod";
import { User } from "@prisma/client";
import { UnauthorizedException } from "../exceptions/UnAuthorizedException";
import zod from "zod";
import { comparePassword } from "../util/user.utils";

export const AuthService = {
    validateUser: async (loginBody: zod.infer<typeof LoginBodySchema>): Promise<User> => {
        const foundUser = await usersService.findByUsername(loginBody.username);
        if (!foundUser) throw new UnauthorizedException('Incorrect Username or Password');
        await comparePassword(loginBody.password, foundUser.password);
        return foundUser;
    },

    register: async (registerBodyDto: zod.infer<typeof RegisterBodySchema>): Promise<User> => {
        const user = await usersService.findByUsername(registerBodyDto.username);
        if (user) {
            throw new UnauthorizedException('Username already exists');
        }
        const insertedUser = await usersService.createUser(registerBodyDto);
        if (!insertedUser) {
            throw new UnauthorizedException('User not registered');
        }
        return insertedUser;
    },
    generateJwtToken: async function (data: any, secret: string, expiresIn: string): Promise<string> {
        return jwt.sign(data, secret, { expiresIn });
    },

    signJwtAccessToken: async function (user: Partial<User>): Promise<string> {
        const signedAccessToken = {
            username: user.username,
            email: user.email,
            sub: user.id,
        };
        if (!process.env.JWT_ACCESS_TOKEN_SECRET || !process.env.JWT_ACCESS_EXPIRATION_TIME) {
            throw new Error("JWT access token secret or expiration time is not defined");
        }
        return this.generateJwtToken(signedAccessToken, process.env.JWT_ACCESS_TOKEN_SECRET, process.env.JWT_ACCESS_EXPIRATION_TIME);
    }
    ,
    signJwtRefreshToken: async (user: Partial<User>): Promise<string> => {
        const signedRefreshToken = {
            sub: user.id,
        };
        return generateJwtToken(signedRefreshToken, config.get<string>('JWT_REFRESH_TOKEN_SECRET'), config.get<string>('JWT_REFRESH_EXPIRATION_TIME'));
    },


    refreshToken: async (response: Response, user: Partial<User>) =>{
        const newRefreshToken = await signJwtRefreshToken(user);
        const expiresIn = new Date(new Date().getTime() + parseInt(config.get<string>('JWT_REFRESH_EXPIRATION_TIME')) * 60000);
        await usersService.updateRefreshToken(user.id, newRefreshToken, expiresIn);
        const newAccessToken = await signJwtAccessToken(user);

        return response.send({
            data: {
                newRefreshToken,
                newAccessToken,
                expiresIn,
            },
        });
    },

    forgotPassword: async (email: string) =>{
        const user = await usersService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');
        const emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();

        const existingForgottenPassword = await emailVerificationRepository.getEmailVerificationData({ email });
        if (existingForgottenPassword) {
            throw new BadRequestException('A password reset request already exists for this email');
        }
        const createEmailVerificationPayload: ICreateEmailVerification = {
            email,
            emailToken,
            timestamp: new Date(),
        };
        const createdEmailVerifyCode = await emailVerificationRepository.createEmailVerification(createEmailVerificationPayload);
        if (!createdEmailVerifyCode) throw new BadRequestException('Email verification code not created');
        const content = `Press here to reset your password `;
        await sendEmailVerificationRequest(email, content);
        return createdEmailVerifyCode.raw;
    },

    resetPassword: async (resetPasswordDto: ResetPasswordDto): Promise<string> => {
        const { email, currentPassword, newPassword } = resetPasswordDto;
        const forgottenPassword = await emailVerificationRepository.getEmailVerificationData({ email });
        if (!forgottenPassword) {
            throw new NotFoundException('This token does not exist');
        }
        const userData = await usersService.getUserByEmail(email);
        if (!userData) {
            throw new NotFoundException('This user does not exist');
        }
        const isValidPassword = await User.comparePassword(currentPassword, userData);
        if (!isValidPassword) {
            throw new BadRequestException('The current password is incorrect');
        }
        const encryptedPassword = newPassword; // will be encrypted in entity class.
        const updateResult = await usersService.editUserPassword(email, encryptedPassword);
        await usersService.updateRefreshToken(userData.id, '', new Date());
        if (updateResult.affected === 0) {
            throw new ConflictException('There may be an error in the data entered!');
        }
        return 'Password updated successfully';
    },

    deleteEmailVerificationById: async (id: string) => {
        return emailVerificationRepository.deleteForgottenPasswordTokenById(id);
    },

    sendEmailVerificationRequest: async (email: string, emailToken?: string, content?: string): Promise<string> => {
        if (!emailToken) emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
        console.log('💛💛emailToken', emailToken);
        if (!content) content = 'Thanks for registration please verify your email';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Email must be a valid @gmail.com address');
        }
        const sendMailPayload = {
            from: 'Ahmed-fahmy <ahmedfahmy212@gmail.com>',
            to: `${email}`,
            subject: 'Verify Email',
            text: 'Verify Email',
            html: `Hi <br><br> ${content}<br><br>   
            <h3>Token: ${emailToken}</h3>`,
        };
        const sendMail = await transporter.sendMail(sendMailPayload);
        if (!sendMail) throw new BadRequestException('Email not sent');
        return 'Email verification code sent successfully';
    },
}
