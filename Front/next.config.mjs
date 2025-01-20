/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const nextConfig = {
    reactStrictMode: true,
    env: {
        REACT_APP_SITE_KEY: process.env.REACT_APP_SITE_KEY,
        SITE_SECRET: process.env.SITE_SECRET,
    },
};
export default nextConfig;
