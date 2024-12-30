import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	env: {
		SERVER_URL: process.env.SERVER_URL,
	}
};

export default nextConfig;
