import { Request, Response, NextFunction } from 'express'
import ErrorResponse from '../utils/errorResponse'

type ResponseError = Error & { 
    statusCode?: number, 
    code?: number, 
    value?: string
    errors?: Error[]
}

const errorHandler = (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack)

    let error = { ...err }
    error.message = err.message

    // handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Request not found with id of ${error.value}`
        error = new ErrorResponse(message, 404)
    }
    
    // handle Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered'
        error = new ErrorResponse(message, 400)
    }
    
    // handle Mongoose validation error
    if (err.name === 'ValidationError') {
        // TODO: check if there is a better way to handle TS errors
        const errors = err.errors

        if (errors) {
            const messages = Object.values(errors).map((value) => value.message)
            error = new ErrorResponse(messages.join(', '), 400)
        }
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' })
}

export default errorHandler