
import { Response } from 'express';

const response = {
    success: (res: Response, data: any) => {
        return res.status(200).json({
            status: 200,
            message: data || [], 
        });
    },
    created: (res: Response, data: any) => {
        return res.status(201).json({
            status: 201,
            message: data || [],
        });
    }
};

export default response;
