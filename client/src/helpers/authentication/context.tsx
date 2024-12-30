'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { createSession, verifySession, deleteSession } from "./session";
import { User } from '@/types/interfaces';

interface UserContextType {
	user: User | null,
	setUser: (data: User | null) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

interface UserProviderProps {
	children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const userData = await verifySession();
			setUser(userData);
			setLoading(false);
 		};
		fetchUser();
	}, []);

	const updateUser = async (data: User | null) => {
		if (data) await createSession(data);
		else await deleteSession();
		setUser(data);
	}

	if (loading) {
		return <p className="text-center p-6">Loading...</p>;
	}

	return (
		<UserContext.Provider value={{ user, setUser: updateUser }}>
			{ children }
		</UserContext.Provider>
	);
};
