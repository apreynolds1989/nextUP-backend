import { Request, Response, NextFunction } from 'express';

export const loggerFunc = (req: Request, res: Response, next: NextFunction): void => {
    console.log(`LOGGED at ${new Date}`);
    next();
};