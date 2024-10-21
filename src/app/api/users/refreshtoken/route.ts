import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import jwt from 'jsonwebtoken'
import { TOKEN } from "@/models/tokenModel";
import { SESSION } from "@/models/sessionModel";
import { USER } from "@/models/userModel";
import { generateToken } from "@/helpers/authHelpers";
connect();

export async function POST(request: NextRequest) {
    try {
        let body: any = await request.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            throw new AppError('refreshToken is required', 400)
        }

        const decoded = jwt.decode(refreshToken, { complete: true }) as any;


        if (decoded.payload && decoded.payload.exp) {

            const currentTime = Math.floor(Date.now() / 1000); // Get current time in Unix format

            if (decoded.payload.exp < currentTime) {
                throw new AppError('Refresh token has expired.');
            }

        } else {
            throw new AppError('Invalid refresh token payload.');
        }

        const tokenData = await TOKEN.findOne({ refreshToken });
        const sessionData = await SESSION.findOne({ accessToken: tokenData?.accessToken, isActive: true });

        if (!tokenData || !sessionData) {
            throw new AppError('Invalid refresh token.');
        }

        const user = await USER.findById(decoded.payload.userId);
        if (!user) {
            throw new AppError('User not found.');
        }

        const objectToCreateToken = {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        const newAccessToken = await generateToken(objectToCreateToken);

        tokenData.accessToken = newAccessToken;
        await tokenData.save();

        sessionData.accessToken = newAccessToken;
        await sessionData.save();

        return NextResponse.json({
            statusCode: 200,
            message: 'Token refreshed successfully.',
            accessToken: newAccessToken,
            userId: user?._id,
            role: user?.role,
        });


    } catch (error: any) {

        if (error instanceof AppError) {
            return error.handleResponse();
        }
        const appError = new AppError("Unexpected error occurred", 500);
        return appError.handleResponse();
    }
}

