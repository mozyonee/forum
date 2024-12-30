import { useState, FormEvent } from "react";
import { useUser } from '@/helpers/authentication/context';
import api from "@/helpers/api";

import { Post } from '@/types/interfaces'

interface InputProps {
	parent: string | null;
	setParent: React.Dispatch<React.SetStateAction<Post[]>>;
} 

const Input: React.FC<InputProps> = ({ parent, setParent }) => {
	const [text, setText] = useState('');
	const { user } = useUser();

	const createPost = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	
		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(formData.entries()) as { [key: string]: string | null };
		data.author = user?._id || null;
		data.parent = parent;
		api.post('/posts', data)
			.then(response => setParent((prevPosts) => [...prevPosts, response.data]))
			.catch(error => console.log(error));
	}

	const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const textarea = event.target;
		setText(textarea.value);
	
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	return <>
		{ user && 
			<form onSubmit={createPost} className="flex">
				<textarea name="text" placeholder="text" required value={text} onChange={handleTextChange} className="p-3 flex-1 bg-transparent border border-white resize-none overflow-hidden" />
				<input type="submit" className="p-3 border border-white" />
			</form>
		}
	</>;
}

export default Input