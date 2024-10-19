import { NextResponse } from "next/server";

// Class for handling application errors
export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
    }

    // Method to format the error response
    public handleResponse() {
        return NextResponse.json(
            { statusCode: this.statusCode, message: this.message },
            { status: this.statusCode }
        );
    }
}
