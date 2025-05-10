export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string, statusCode: number, isOperational: boolean, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this);
        }
    }
}

// Not Found Error
export class NotFound extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, true);
    }
}

// Validation Error (used for Zod/React Hook Form)
export class ValidationError extends AppError {
    constructor(message = "Invalid request data", details?: any) {
        super(message, 400, true, details);
    }
}

// Authentication Error
export class AuthError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, true);
    }
}

// Forbidden Error
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403, true);
    }
}

// Service Unavailable Error (503)
export class ServiceUnavailable extends AppError {
    constructor(message = "Service Unavailable", details?: any) {
        super(message, 503, true, details);
    }
}