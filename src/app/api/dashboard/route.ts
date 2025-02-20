import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import { USER } from "@/models/userModel";
import { SESSION } from "@/models/sessionModel";
connect();

export async function POST(request: NextRequest) {
    try {

        const authorizationHeader = request.headers.get('authorization');
        if (!authorizationHeader) {
            throw new AppError('Authorization header missing.', 400);
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new AppError('Invalid authorization header format.', 400);
        }

        const findSession : any = await SESSION.findOne({ accessToken: token, isActive: true });
        if (!findSession) {
            throw new AppError('Please provide a valid token.', 401);
        }

        const User = await USER.findById(findSession?.userId)

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

