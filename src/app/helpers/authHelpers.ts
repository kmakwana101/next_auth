import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const options1: jwt.SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN_DAY,
    algorithm: 'RS256'
};

let secretKey: string;

try {
    secretKey = fs.readFileSync(path.join(process.cwd(), 'src', 'jwtRS256.key'), 'utf8').trim();
} catch (error) {
    console.error('Error reading secret key file:', error);
}

export async function generateToken(objectToCreateToken: any, options: jwt.SignOptions = options1) {
    const tokenOptions = options || options1;
    return await jwt.sign(objectToCreateToken, secretKey, tokenOptions);
}

export function OTPGenerator(): number {
    return Math.floor(900000 * Math.random() + 100000);
  }