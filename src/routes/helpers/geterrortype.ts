import type { Response } from "express";

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: "Invalid username or password",
    MAX_SESSIONS: "Max sessions limit reached",
    TOKEN_CREATION_FAILED: "Couldn't create token"
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;

export class AppError extends Error {
    constructor(
        public readonly code: ErrorCode,
        public readonly statusCode: number
    ) {
        super(ERROR_MESSAGES[code]);
        this.name = "AppError";
    }
}

export const catchResponse = (
    res: Response,
    err: AppError
) => {
    return res.status(err.statusCode).json({
    message: `[Error]: ${err.message}`,
    code: err.code,
    success: false
});
};