import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/app/helpers/errorHandler";
import { USER } from "@/app/models/userModel";
import { OTPGenerator } from "@/app/helpers/authHelpers";
import { USER_VERIFICATION } from "@/app/models/userVerificationModel";
import { sendMail } from "@/app/helpers/sendMail";
connect();

export async function POST(request: NextRequest) {
    try {

        let body: any = await request.json();
        const { email } = body;

        if (!email) {
            throw new AppError('email is required', 400)
        }

        const User = await USER.findOne({ email: email });
        console.log(User)
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

