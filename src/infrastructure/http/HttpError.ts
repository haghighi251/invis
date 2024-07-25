type ErrorOptions = {
    stack?: string;
    status?: number;
    data?: Record<string, unknown>;
};
class HttpError extends Error {
    public readonly message: string;
    public readonly status?: number;
    public readonly data?: Record<string, any>;

    constructor(message: string, options: ErrorOptions = {}) {
        super();
        this.message = message;
        this.stack = options.stack;
        this.status = options.status;
        this.name = this.constructor.name;
        this.data = options.data;

        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export { HttpError };
