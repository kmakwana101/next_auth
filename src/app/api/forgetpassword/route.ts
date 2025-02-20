import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import { USER } from "@/models/userModel";
import { OTPGenerator } from "@/helpers/authHelpers";
import { USER_VERIFICATION } from "@/models/userVerificationModel";
import { sendMail } from "@/helpers/sendMail";
connect();

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {

        let body: any = await request.json();
        const { email } = body;

        if (!email) {
            throw new AppError('email is required', 400)
        }

        const User = await USER.findOne({ email: email });
        if (!User) {
            throw new AppError("User not Found.", 400);
        }

        await USER_VERIFICATION.deleteMany({ email: User.email });

        let otp = await OTPGenerator();

        await USER_VERIFICATION.create({
            verificationCode: otp,
            email: User?.email
        })

        await sendMail(User?.email, `Forget Password `, `OTP : ${otp}`).catch(err => console.log(err));

        return NextResponse.json({
            statusCode: 201,
            message: 'Verification code sent successfully',
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            return error.handleResponse();
        }
        const appError = new AppError("Unexpected error occurred", 500);
        return appError.handleResponse();
    }
}

