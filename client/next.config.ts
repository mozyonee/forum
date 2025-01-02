import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	env: {
		CLIENT_URL: process.env.CLIENT_URL,
		SERVER_URL: process.env.SERVER_URL
	}
};

export default nextConfig;