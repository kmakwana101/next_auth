import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import { USER } from "@/models/userModel";
connect();

export async function POST(request: NextRequest) {
    try {

        const userId = request.headers.get('userid')
        const User = await USER.findById(userId)

        if (!User) {
            throw new AppError('User Not found.')
        }

        return NextResponse.json({
            statusCode: 200,
            message: 'Your verification code is accepted.',
            data: User
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            return error.handleResponse();
        }
        const appError = new AppError("Unexpected error occurred", 500);
        return appError.handleResponse();
    }
}

