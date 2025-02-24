export const runtime = 'nodejs';

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
    console.log('POST /api/login - Request received');

    try {

        let body: any = await request.json();
        const { email, password, notificationToken, ipAddress, deviceName, platform, version } = body;

        if (!email) {
            throw new AppError('Email is required', 400);
        } else if (!password) {
            throw new AppError('Password is required', 400);
        }

        const User = await USER.findOne({ $or: [{ email: email }, { username: email }] });

        if (!User) {
            throw new AppError('User not found.', 400);
        }

        const passwordMatch = await bcrypt.compare(password, User?.password);

        if (!passwordMatch) {
            throw new AppError('Password invalid', 400);
        }

        const objectToCreateToken: any = {
            userId: User?._id,
            username: User?.username,
            email: User?.email,
            role: User?.role,
        };

        let accessToken = await generateToken(objectToCreateToken);
        const refreshToken = await generateToken({ userId: User._id }, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN_DAY,
            algorithm: 'RS256',
        });

        await TOKEN.create({
            userId: User._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });

        await SESSION.create({
            userId: User._id,
            notificationToken: notificationToken || null,
            accessToken: accessToken,
            userAgent: request.headers.get('user-agent') || '', // Extract from request
            ipAddress: ipAddress || request.headers.get('x-forwarded-for') || '', // Extract from request if available
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
        console.error('Error in /api/login:', error);
        if (error instanceof AppError) {
            console.log('AppError caught:', error.message, error.statusCode);
            return error.handleResponse();
        }
        const appError = new AppError('Unexpected error occurred', 500);
        console.log('Unexpected error caught:', appError.message, appError.statusCode);
        return appError.handleResponse();
    }
}

