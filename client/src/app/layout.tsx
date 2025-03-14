import UserProvider from '@/helpers/authentication/context';
import Header from '@/components/Header';
import '@/styles/globals.css';
import { EdgeStoreProvider } from '../lib/edgestore';

export const metadata = {
	title: "f4",
	description: "f4", 
	icons: {
		icon: [{ url: "/favicon.png", sizes: "64x64", type: "image/png" }],
		apple: [{ url: "/icon.png" }],
	},
	appleTouchIcon: "/icon.png",
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
	},
};

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
	return (
		<html lang="en">
			<body className="antialiased">
				<EdgeStoreProvider>
					<UserProvider>
						<Header />
						<main>{children}</main>
					</UserProvider>
				</EdgeStoreProvider>
			</body>
		</html>
	);
}
