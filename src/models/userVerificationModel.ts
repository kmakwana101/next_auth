import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the UserVerification document
interface IUserVerification extends Document {
  email: string;  // User's email for verification
  verificationCode: number;  // Verification code
}

// Define the UserVerification schema
const userVerificationSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },  // Required email field
  verificationCode: { type: Number, required: true },  // Required verification code
}, { timestamps: true });  // Automatically add createdAt and updatedAt timestamps

// Create the UserVerification model or use the existing model if it already exists
export const USER_VERIFICATION = mongoose.models.userverifications || mongoose.model<IUserVerification>('userverifications', userVerificationSchema);

