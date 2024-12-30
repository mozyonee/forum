import UserProvider from '@/helpers/authentication/context';
import Header from '@/components/Header';
import '@/styles/globals.css';

const defaultUrl = process.env.CLIENT_URL || "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "f4",
	description: "f4",
	icons: {
		icon: [{ url: "/favicon.png", sizes: "64x64", type: "image/png" }],
		apple: [{ url: "/icon.png" }]
	},
	appleTouchIcon: "/icon.png",
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent"
	}
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

	return (
		<html lang="en">
			<body className="antialiased">
				<UserProvider>
					<Header />
					<main>{children}</main>
				</UserProvider>
			</body>
		</html>
	);
}
