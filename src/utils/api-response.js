export class ApiResponse {
    constructor(message, data = null) {
        this.message = message;
        if (data) this.data = data;
    }
}

export class ApiError extends Error {
    constructor(statusCode, message, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}