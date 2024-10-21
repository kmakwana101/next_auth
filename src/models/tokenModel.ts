import mongoose, { Schema, Document } from 'mongoose';

interface IToken extends Document {
    userId: string;  // Use string if you're storing ObjectId references
    accessToken: string;
    refreshToken?: string;  // Optional field
}

const tokenSchema: Schema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },  // Reference to User model
    accessToken: { type: String, required: true },
    refreshToken: { type: String },  // Can be null if you don't use refresh tokens
}, { timestamps: true });

// Create the Token model or use the existing model if it already exists
export const TOKEN = mongoose.models.tokens || mongoose.model<IToken>('tokens', tokenSchema);
