import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import { SESSION } from "@/models/sessionModel";
connect();

export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
    try {
        const headers: any = request.headers;
        // console.log(request.headers.get('userid'), 'userid'); // Correctly access the userid header
        // console.log(headers, 'headers');
        const authorizationHeader = request.headers.get('authorization');
        if (!authorizationHeader) {
            throw new AppError('Authorization header missing.', 400);
        }

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
