import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/app/helpers/errorHandler";
import { SESSION } from "@/app/models/sessionModel";
connect();

export async function POST(request: NextRequest) {
    try {

        const authorizationHeader = request.headers.get('authorization');
        console.log(request.headers)
        if (!authorizationHeader) {
            throw new AppError('Authorization header missing.', 400);
        }

        // Extract the token, ensuring correct format
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new AppError('Invalid authorization header format.', 400);
        }

        const findSession = await SESSION.findOne({ accessToken: token, isActive: true });
        if (!findSession) {
            throw new AppError('Please provide a valid token.', 401);
        }

        findSession.isActive = false;
        await findSession.save();

        return NextResponse.json({
            statusCode: 201,
            message: 'Your session has been deactivated.',
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            return error.handleResponse();
        }
        const appError = new AppError("Unexpected error occurred", 500);
        return appError.handleResponse();
    }
}
