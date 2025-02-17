import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	env: {
		EDGE_STORE_ACCESS_KEY: process.env.EDGE_STORE_ACCESS_KEY,
		EDGE_STORE_SECRET_KEY: process.env.EDGE_STORE_SECRET_KEY,
		SERVER_URL: process.env.SERVER_URL
	}
};

export default nextConfig;