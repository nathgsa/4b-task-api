class HttpError extends Error {
    
    constructor(message, statusCode = 500){
        super(message)
        this.statusCode = statusCode
        this.name = 'HttpError'
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = HttpError