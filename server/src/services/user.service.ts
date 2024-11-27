// import { comparePassword } from '../util/user.utils';
// import prisma from '../../prisma/client';
// import { User } from '@prisma/client';
// import { NotFoundException } from '../exceptions/NotFoundException';

// export const UserService = {
//     findById: async (id: number): Promise<User> => {
//         const user = await prisma.user.findUnique({
//             where: { id },
//         });
//         if (!user) throw new NotFoundException('User not found');
//         return user;
//     },

//     findByUsername: async (username: string): Promise<User> => {
//         const user = await prisma.user.findUnique({
//             where: { username },
//         });
//         if (!user) throw new NotFoundException('User not found');
//         return user;
//     },

//     findByEmail: async (email: string): Promise<User | null> => {
//         return prisma.user.findUnique({
//             where: { email },
//         });
//     },

//     createUser: async (data: any): Promise<User> => {
//         const user = prisma.user.create({
//             data,
//         });
//         if (!user) throw new NotFoundException('User not created');
//         return user;
//     },

//     updatePassword: async (email: string, newPassword: string): Promise<void> => {
//         const result = await prisma.user.update({
//             where: { email },
//             data: { password: newPassword },
//         });
//         if (!result) throw new NotFoundException('Failed to update password. User not found.');
//     },

//     verifyUser: async (userId: number): Promise<void> => {
//         const result = await prisma.user.update({
//             where: { id: userId },
//             data: { isEmailVerified: true },
//         });
//         if (!result) throw new NotFoundException('Failed to verify user.');
//     },

//     updateRefreshToken: async (userId: number, refreshToken: string, refreshTokenExpiration: Date): Promise<void> => {
//         await prisma.user.update({
//             where: { id: userId },
//             data: { refreshToken, refreshTokenExpiration },
//         });
//     },

//     validatePassword: async (inputPassword: string, storedPassword: string): Promise<boolean> => {
//         const isValid = await comparePassword(inputPassword, storedPassword);
//         if (!isValid) throw new NotFoundException('Invalid password');
//         return true;
//     },
// };