import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/helpers/errorHandler";
import { USER } from "@/models/userModel";
import { userValidation } from "@/validations/userValidation";
import * as bcrypt from "bcrypt";

connect();

export async function POST(request: NextRequest) {
    try {
        
        let formData: FormData | null = null;
        let body: any = null;

        const contentType = request.headers.get("content-type");

        if (contentType?.includes("multipart/form-data")) {
            formData = await request.formData(); // Handle FormData
            console.log('Received FormData:', Array.from(formData.entries())); // Log all entries
        } else if (contentType?.includes("application/json")) {
            body = await request.json(); // Handle JSON payload
            console.log('Received JSON:', body);
        } else {
            throw new AppError("Unsupported content type", 415);
        }

        const email = formData ? formData.get("email")?.toString() : body?.email;
        const mobileNumber = formData ? formData.get("mobileNumber")?.toString() : body?.mobileNumber;
        const password = formData ? formData.get("password")?.toString() : body?.password;
        const profileImage = formData ? formData.get("profileImage")?.toString() : body?.profileImage;
        const role = formData ? formData.get("role")?.toString() : body?.role;
        const username = formData ? formData.get("username")?.toString() : body?.username;

        console.log('Extracted values:', { email, mobileNumber, password, profileImage, role, username });

        const { error } = userValidation.validate({
            email,
            mobileNumber,
            password,
            profileImage,
            role,
            username
        }, { abortEarly: false });

        if (error) {
            const validationErrors = error.details.map((detail) => detail.message);
            throw new AppError(validationErrors[0], 400);
        }

        const findUser = await USER.findOne({ email });
        if (findUser) {
            throw new AppError("Email is already registered", 400);
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await USER.create({
            email,
            username,
            password: hashPassword,
            role,
            isDeleted: false,
            mobileNumber,
            profileImage,
        });

        return NextResponse.json({
            statusCode: 201,
            message: "User registered successfully",
            data: newUser,
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            return error.handleResponse();
        }
        const appError = new AppError("Unexpected error occurred", 500);
        return appError.handleResponse();
    }
}
