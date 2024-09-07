require('dotenv').config(); //must be on top, above imported services

import jwt from "jsonwebtoken";
import User from "../sequelize/models/User";
import bcrypt from "bcryptjs";

interface TokenData {
    id: number;
    email: string;
}

export async function getParsedAuthorizationHeader(authorizationHeader: string): Promise<TokenData | null> {
    let tokenMatch = /Bearer (.+)/.exec(authorizationHeader);
    if (!tokenMatch) {
        return null;
    }
    return await getParsedToken(tokenMatch[1]);
}

export async function getParsedToken(token: string): Promise<TokenData | null> {
    return new Promise((resolve, reject) => jwt.verify(token, process.env['JWT_SECRET_KEY']!, (err: any, parsedToken: any) => {
        if (err) {
            reject(err);
        } else {
            resolve(parsedToken);
        }
    }))
}

export function createToken(user: User) {
    let tokenData = {id: user.id, email: user.email} as TokenData;
    return jwt.sign(tokenData, process.env['JWT_SECRET_KEY']!, {expiresIn: '1h'});
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}
