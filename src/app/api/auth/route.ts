import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { SESSION } from '@/models/sessionModel';

export async function POST(req: NextRequest) {


    const authorizationHeader = req.headers.get('authorization');
    const token = authorizationHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({
            statusCode: 401,
            message: 'A token is required for authentication.',
        }, { status: 401 });
    }

    const session = await SESSION.findOne({ accessToken: token });

    if (!session) {
        return NextResponse.json({
            statusCode: 401,
            message: 'Please provide a valid session.',
        }, { status: 401 });
    }

    if (!session.isActive) {
        return NextResponse.json({
            statusCode: 401,
            message: 'Your session is expired.',
        }, { status: 401 });
    }

    const decodedToken: any = jwt.decode(token);

    if (decodedToken && decodedToken.exp) {

        const tokenExpiresAt = decodedToken.exp * 1000;
        const currentTime = Date.now();
        // console.log(decodedToken)
        if (tokenExpiresAt > currentTime) {

            return NextResponse.json({
                statusCode: 200,
                message: 'Session is valid',
                userId: decodedToken?.userId,
                accessToken: token
            }, { status: 200 });

        } else {
            console.log('token expire')
            return NextResponse.json({
                statusCode: 401,
                message: 'Token expired.',
            }, { status: 401 });

        }
    } else {

        return NextResponse.json({
            statusCode: 401,
            message: 'Token is not valid.',
        }, { status: 401 });

    }
}
