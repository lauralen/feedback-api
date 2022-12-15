import { Request, Response, NextFunction } from 'express'

// example of custom middleware, not actually used
const logger = (req:Request, res: Response, next: NextFunction) => {
    const {method, protocol, originalUrl: url} = req
  
    console.log(`${method} ${protocol}://${req.get('host')}${url}`);
    next()
}

export default logger