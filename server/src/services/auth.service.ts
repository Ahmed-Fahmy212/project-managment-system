// import { UserService as usersService } from "./user.service";
// import { LoginBodySchema, RegisterBodySchema, ResetPasswordSchema } from "../validations/auth.zod";
// import { User } from "@prisma/client";
// import { UnauthorizedException } from "../exceptions/UnAuthorizedException";
// import zod from "zod";
// import { comparePassword, hashPassword } from "../util/user.utils";
// import jwt from 'jsonwebtoken';
// import { Response } from 'express';
// import { EmailVerificationService as emailVerificationService } from "./email-verification.service";
// import { BadRequestException } from "../exceptions/BadRequestException";
// import { ICreateEmailVerification } from "../interfaces/email-interfaces";
// import { sendEmailVerificationRequest } from "../util/email-verification";
// import { NotFoundException } from "../exceptions/NotFoundException";

// //-------------------------------------------------------------------------------------------------------------------
// export async function validateUser(loginBody: zod.infer<typeof LoginBodySchema>): Promise<User> {
//     const foundUser = await usersService.findByUsername(loginBody.username);
//     if (!foundUser) throw new UnauthorizedException('Incorrect Username or Password');
//     await comparePassword(loginBody.password, foundUser.password);
//     return foundUser;
// }

// //-------------------------------------------------------------------------------------------------------------------
// // Register a new user
// export async function registerUser(registerBodyDto: zod.infer<typeof RegisterBodySchema>): Promise<User> {
//     const user = await usersService.findByUsername(registerBodyDto.username);
//     if (user) {
//         throw new UnauthorizedException('Username already exists');
//     }
//     const insertedUser = await usersService.createUser(registerBodyDto);
//     if (!insertedUser) {
//         throw new UnauthorizedException('User not registered');
//     }
//     return insertedUser;
// }

// //-------------------------------------------------------------------------------------------------------------------// Handle JWT token generation
// export async function handleTokenGeneration(user: User) {
//     const accessToken = await signJwtAccessToken(user);
//     const refreshToken = await signJwtRefreshToken(user);
//     await updateRefreshToken(user, refreshToken);

//     return { accessToken, refreshToken };
// }

// //-------------------------------------------------------------------------------------------------------------------
// export async function updateRefreshToken(user: Partial<User>, refreshToken: string) {
//     const refreshTokenExpiration = process.env.JWT_REFRESH_TOKEN_EXPIRATION;
//     if (!refreshTokenExpiration) {
//         throw new Error("JWT refresh token expiration time is not defined");
//     }
//     const expiration = new Date(new Date().getTime() + parseInt(refreshTokenExpiration) * 60000);
//     if (!user.id) {
//         throw new UnauthorizedException('User ID is not defined');
//     }
//     await usersService.updateRefreshToken(user.id, refreshToken, expiration);
// }


// //-------------------------------------------------------------------------------------------------------------------
// export async function signJwtAccessToken(user: Partial<User>): Promise<string> {
//     const signedAccessToken = {
//         username: user.username,
//         email: user.email,
//         sub: user.id,
//     };

//     const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
//     const accessTokenExpiration = process.env.JWT_ACCESS_EXPIRATION_TIME;
//     if (!accessTokenSecret || !accessTokenExpiration) {
//         throw new Error("JWT access token secret or expiration time is not defined");
//     }
//     const data = generateJwtToken(signedAccessToken, accessTokenSecret, accessTokenExpiration);
//     return data;
// }

// //-------------------------------------------------------------------------------------------------------------------
// export async function signJwtRefreshToken(user: Partial<User>): Promise<string> {
//     const signedRefreshToken = {
//         sub: user.id,
//     };

//     const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
//     const refreshTokenExpiration = process.env.JWT_REFRESH_EXPIRATION_TIME;
//     if (!refreshTokenSecret || !refreshTokenExpiration) {
//         throw new Error("JWT refresh token secret or expiration time is not defined");
//     }
//     return generateJwtToken(signedRefreshToken, refreshTokenSecret, refreshTokenExpiration);
// }

// //-------------------------------------------------------------------------------------------------------------------
// export async function refreshToken(response: Response, user: Partial<User>) {
//     const newRefreshToken = await signJwtRefreshToken(user);
//     const refreshExpirationTime = process.env.JWT_REFRESH_EXPIRATION_TIME;
//     if (!refreshExpirationTime) {
//         throw new Error("JWT refresh expiration time is not defined");
//     }
//     const expiresIn = new Date(new Date().getTime() + (parseInt(refreshExpirationTime)) * 60000);
//     if (!user.id) throw new UnauthorizedException('User not found');
//     await usersService.updateRefreshToken(user.id, newRefreshToken, expiresIn);
//     const newAccessToken = await signJwtAccessToken(user);

//     return response.send({
//         data: {
//             newRefreshToken,
//             newAccessToken,
//             expiresIn,
//         },
//     });
// }

// //-------------------------------------------------------------------------------------------------------------------
// export async function forgotPassword(email: string) {
//     const user = await usersService.findByEmail(email);
//     if (!user) throw new UnauthorizedException('User not found');
//     const emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();

//     const existingForgottenPassword = await emailVerificationService.getEmailVerificationData({ email });
//     if (existingForgottenPassword) {
//         throw new BadRequestException('A password reset request already exists for this email');
//     }
//     const createEmailVerificationPayload: ICreateEmailVerification = {
//         email,
//         emailToken,
//         timestamp: new Date(),
//     };

//     const createdEmailVerifyCode = await emailVerificationService.createEmailVerification(createEmailVerificationPayload);
//     if (!createdEmailVerifyCode) throw new BadRequestException('Email verification code not created');
//     const content = `Press here to reset your password `;
//     await sendEmailVerificationRequest(email, content);
//     return createdEmailVerifyCode;
// }

// //-------------------------------------------------------------------------------------------------------------------
// export async function generateEmailVerification(email: string): Promise<any> {
//     const emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
//     const createEmailVerificationPayload: ICreateEmailVerification = {
//         email,
//         emailToken,
//         timestamp: new Date()
//     };
//     const createdEmailVerifyCode = await emailVerificationService.createEmailVerification(createEmailVerificationPayload);
//     if (!createdEmailVerifyCode) throw new BadRequestException('Email verification code not created');
//     await sendEmailVerificationRequest(email, emailToken);

//     return createdEmailVerifyCode;
// }

// //-------------------------------------------------------------------------------------------------------------------
// export async function resetPassword(resetPasswordDto: zod.infer<typeof ResetPasswordSchema>): Promise<string> {
//     const { email, currentPassword, newPassword } = resetPasswordDto;
//     const forgottenPassword = await emailVerificationService.getEmailVerificationData({ email });
//     if (!forgottenPassword) {
//         throw new NotFoundException('This token does not exist');
//     }
//     const userData = await usersService.findByEmail(email);
//     if (!userData) {
//         throw new NotFoundException('This user does not exist');
//     }
//     const isValidPassword = await comparePassword(currentPassword, userData.password);
//     if (!isValidPassword) {
//         throw new BadRequestException('The current password is incorrect');
//     }
//     const encryptedPassword = await hashPassword(newPassword);
//     await usersService.updatePassword(email, encryptedPassword);
//     await usersService.updateRefreshToken(userData.id, '', new Date());

//     return 'Password updated successfully';
// }

// //-------------------------------------------------------------------------------------------------------------------
// export async function verifyEmail(email: string, token: string): Promise<Partial<User>> {
//     const emailVerificationData = await emailVerificationService.getEmailVerificationData({ email });
//     if (!emailVerificationData || !emailVerificationData.email || !emailVerificationData.emailToken) {
//         throw new BadRequestException("Invalid email token, please send a valid one");
//     }
//     if (emailVerificationData.emailToken !== token) {
//         throw new BadRequestException("Invalid token");
//     }

//     const currentTime = new Date();
//     const timestamp = new Date(emailVerificationData.timestamp);
//     const timeDifferenceInMinutes = (currentTime.getTime() - timestamp.getTime()) / (1000 * 60);
//     if (timeDifferenceInMinutes > 10) {
//         throw new BadRequestException('Verification code has expired.');
//     }

//     const userData = await usersService.findByEmail(emailVerificationData.email);
//     if (!userData) {
//         throw new UnauthorizedException('User not found');
//     }
//     if (userData.isEmailVerified) {
//         throw new UnauthorizedException('Email already verified');
//     }

//     await usersService.verifyUser(userData.id);
//     await deleteEmailVerificationById(emailVerificationData.id);
//     userData.isEmailVerified = true;
//     const { password, ...safeUserData } = userData;
//     return safeUserData;
// }
// //-------------------------------------------------------------------------------------------------------------------

// async function deleteEmailVerificationById(id: string) {
//     return emailVerificationService.deleteForgottenPasswordTokenById(id);
// }

// async function generateJwtToken(data: any, secret: string, expiresIn: string) {
//     return jwt.sign(data, secret, { expiresIn });
// }
