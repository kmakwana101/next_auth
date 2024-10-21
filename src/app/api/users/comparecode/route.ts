import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import { USER_VERIFICATION } from "@/models/userVerificationModel";
connect();

export async function POST(request: NextRequest) {
    try {

        let body: any = await request.json();
        const { email, verificationCode } = body;

        if (!email) {
            throw new AppError('email is required', 400)
        } else if (!verificationCode) {
            throw new AppError('verificationCode is required', 400)
        }

        const reset = await USER_VERIFICATION.findOne({ email: email, verificationCode: verificationCode });

        if (!reset) {
            throw new AppError('Invalid verification code', 400)
        }

        return NextResponse.json({
            statusCode: 200,
            message: 'Your verification code is accepted.',
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            return error.handleResponse();
        }
        const appError = new AppError("Unexpected error occurred", 500);
        return appError.handleResponse();
    }
}

