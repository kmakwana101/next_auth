import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import { USER } from "@/models/userModel";
import { USER_VERIFICATION } from "@/models/userVerificationModel";
import bcrypt from 'bcrypt'
connect();

export async function POST(request: NextRequest) {
    try {

        let body: any = await request.json();
        const { email, confirmPassword, password } = body;

        if (!email) {
            throw new AppError('email is required', 400)
        } else if (!password) {
            throw new AppError('password is required', 400)
        } else if (!confirmPassword) {
            throw new AppError('email is required', 400)
        } else if (password !== confirmPassword) {
            throw new AppError("Password is not matched with confirmation password.");
        }

        const User: any = await USER.findOne({ email });

        if (!User) {
            throw new AppError('please provide valid email.', 400);
        }

        await USER_VERIFICATION.deleteMany({ email: User.email });

        const oldAndNewPasswordIsSame = await bcrypt.compare(password, User?.password)
        if (oldAndNewPasswordIsSame) {
            throw new AppError('New Password Matches Old Password. Please choose a different password for security purposes.', 400)
        }

        User.password = await bcrypt.hash(password, 10);
        await User.save();

        return NextResponse.json({
            statusCode: 201,
            message: 'Your password has been reset.',
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            return error.handleResponse();
        }
        const appError = new AppError("Unexpected error occurred", 500);
        return appError.handleResponse();
    }
}

