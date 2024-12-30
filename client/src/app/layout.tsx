import UserProvider from '@/helpers/authentication/context';
import Header from '@/components/Header';
import '@/styles/globals.css';

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
