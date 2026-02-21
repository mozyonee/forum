import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	env: {
		EDGE_STORE_ACCESS_KEY: process.env.EDGE_STORE_ACCESS_KEY,
		EDGE_STORE_SECRET_KEY: process.env.EDGE_STORE_SECRET_KEY,
		NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
		SESSION_SECRET: process.env.SESSION_SECRET
	}
};

export default nextConfig;