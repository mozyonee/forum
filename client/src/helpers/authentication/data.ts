import { verifySession } from "./session"
import api from "../api";
import { cache } from "react";

export const getUser = async () => {
	const session = await verifySession();
	const user = await api.get('/auth/status');
	return user;
}