import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  profileImage: string;
  mobileNumber: string;
  isDeleted: boolean;
}

const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  profileImage: { type: String },
  mobileNumber: { type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const USER = mongoose.models.users || mongoose.model<IUser>('users', userSchema);
