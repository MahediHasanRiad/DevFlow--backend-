export class ApiErrorHandler extends Error {
    public statusCode: number;
    public errors: any[];

    constructor(
        statusCode: number, 
        message: string = "Something went wrong", 
        errors: any[] = []
    ) {
        super(message);
        
        this.statusCode = statusCode;
        this.errors = errors;

        Object.setPrototypeOf(this, new.target.prototype);

        Error.captureStackTrace(this, this.constructor);
    }
}