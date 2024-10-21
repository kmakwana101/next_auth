import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import { USER } from "@/models/userModel";
import { TOKEN } from "@/models/tokenModel";
import { SESSION } from "@/models/sessionModel";
import * as bcrypt from "bcrypt";
import { generateToken } from "@/helpers/authHelpers";
connect();

export async function POST(request: NextRequest) {
    try {

        let body: any = await request.json();
        const { email, password, notificationToken, ipAddress, deviceName, platform, version } = body;

        if (!email) {
            throw new AppError('email is required', 400)
        } else if (!password) {
            throw new AppError('password is required', 400)
        }

        const User = await USER.findOne({ email: email });

        if (!User) {
            throw new AppError("User not Found.", 400);
        }

        const passwordMatch = await bcrypt.compare(password, User?.password);

        if (!passwordMatch) {
            throw new AppError('Password invalid');
        }

        const objectToCreateToken: any = {
            userId: User?._id,
            username: User?.username,
            email: User?.email,
            role: User?.role,
        };

        let accessToken = await generateToken(objectToCreateToken)
        const refreshToken = await generateToken({ userId: User._id }, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN_DAY,
            algorithm: 'RS256',
        })

        await TOKEN.create({
            userId: User._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

        await SESSION.create({
            userId: User._id,
            notificationToken: notificationToken || null,
            accessToken: accessToken,
            userAgent: '', // Use request object if you have access (e.g., req.headers['user-agent'])
            ipAddress: ipAddress || '', // Use request object if available (e.g., req.ip)
            deviceName: deviceName || null,
            platform: platform || null,
            version: version || null,
            isActive: true,
        });

        return NextResponse.json({
            statusCode: 200,
            message: 'User logged in successfully.',
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: User?._id,
            role: User?.role,
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            return error.handleResponse();
        }
        const appError = new AppError("Unexpected error occurred", 500);
        return appError.handleResponse();
    }
}

