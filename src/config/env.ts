import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
    const value = process.env[key]

    if(!value){
        throw new Error(`Missing environment variable in env: ${key}`);
    }

    return value;
}

export const env = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
    POSTGRES_PASSWORD: requireEnv('POSTGRES_PASSWORD'),
    DATABASE_URL: requireEnv('DATABASE_URL'),
    JWT_SECRET: requireEnv('JWT_SECRET'),
    RESEND_API_KEY: requireEnv('RESEND_API_KEY'),
    FRONTEND_URL: requireEnv('FRONTEND_URL'),
}