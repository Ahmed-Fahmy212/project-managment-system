import { transporter } from '../configs/nodemailer.config';
import { BadRequestException } from '../exceptions/BadRequestException';


export const sendEmailVerificationRequest = async (email: string, emailToken?: string, content?: string): Promise<string> => {
    if (!emailToken) emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
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

}