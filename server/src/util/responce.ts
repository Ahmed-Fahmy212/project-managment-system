
import { Response } from 'express';

const response = {
    success: (res: Response, data: any) => {
        return res.status(200).json({
            data: data || [],
        });
    },
    created: (res: Response, data: any) => {
        return res.status(201).json({
            data: data || [],
        });
    }
};

export default response;
