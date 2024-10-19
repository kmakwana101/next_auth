import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Session document
interface ISession extends Document {
  userId: string;  // Use string if you're storing ObjectId references
  notificationToken?: string;  // Optional field
  accessToken: string;
  userAgent?: string;  // Optional field
  ipAddress?: string;  // Optional field
  deviceName?: string;  // Optional field
  platform?: string;  // Optional field
  version?: string;  // Optional field
  isActive: boolean;  // Active status of the session
}

// Define the session schema
const sessionSchema: Schema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },  // Reference to User model
  notificationToken: { type: String },  // Optional notification token
  accessToken: { type: String, required: true },  // Required access token
  userAgent: { type: String },  // Optional user agent
  ipAddress: { type: String },  // Optional IP address
  deviceName: { type: String },  // Optional device name
  platform: { type: String },  // Optional platform information
  version: { type: String },  // Optional version information
  isActive: { type: Boolean, default: true, required: true },  // Default is active
}, { timestamps: true });  // Automatically add createdAt and updatedAt timestamps

// Create the Session model or use the existing model if it already exists
export const SESSION = mongoose.models.sessions || mongoose.model<ISession>('sessions', sessionSchema);

