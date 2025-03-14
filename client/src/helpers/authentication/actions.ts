import api from "../api";
import { createSession, verifySession, deleteSession } from "./session";
import { useUser } from "./context";

import { useRouter } from 'next/navigation'

export function useAuthHelpers() {
	const { setUser } = useUser();
	const router = useRouter();

	const register = async (formData: FormData) => {
		const data = {
			username: formData.get('username'),
			email: formData.get('email'),
			password: formData.get('password')
		}

		await api.post("/auth/register", data)
			.then(async (response) => {
				await createSession(response.data);
				const userData = await verifySession();
				await setUser(userData);
				router.push('/');
			})
			.catch((error) => console.log(error));
	};

	const verify = async () => {
		const userData = await verifySession();
		setUser(userData);
	}

	const login = async (input: FormData | { email: string; password: string }) => {

		const data = input instanceof FormData ? {
			email: input.get('email') as string,
			password: input.get('password') as string,
		} : input;

		await api.post("/auth/login", data)
			.then(async (response) => {
				await createSession(response.data);
				const userData = await verifySession();
				setUser(userData);
			})
			.catch((error) => console.log(error));
	};

	const logout = async () => {
		await deleteSession();
		const userData = await verifySession();
		setUser(userData);
	};

	return { register, login, logout, verify };
}
