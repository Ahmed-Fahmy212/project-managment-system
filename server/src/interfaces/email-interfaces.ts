export interface ICreateEmailVerification {
    email: string;
    emailToken: string;
    timestamp: Date;
}

export interface IFilterEmailVerification {
    email?: string;
    emailToken?: string;
}