import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	env: {
		EDGE_STORE_ACCESS_KEY: process.env.EDGE_STORE_ACCESS_KEY,
		EDGE_STORE_SECRET_KEY: process.env.EDGE_STORE_SECRET_KEY,
		CLIENT_HOST: process.env.CLIENT_HOST,
		CLIENT_PORT: process.env.CLIENT_PORT,
		SERVER_HOST: process.env.SERVER_HOST,
		SERVER_PORT: process.env.SERVER_PORT
	}
};

export default nextConfig;