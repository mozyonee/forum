import { useState, FormEvent } from "react";
import { useUser } from '@/helpers/authentication/context';
import { useEdgeStore } from '../lib/edgestore';
import api from "@/helpers/api";
import { Post } from '@/types/interfaces'
import { useDropzone } from 'react-dropzone';
import { DeleteIcon, ImageIcon, SendIcon } from '../../public/icons';
import React from "react";

type FileState = {
	file: File | string;
	key: string;
	progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
};

interface InputProps {
	parent: string | null;
	setParent: React.Dispatch<React.SetStateAction<Post[]>>;
}

function CircleProgress({ progress }: { progress: number }) {
	const strokeWidth = 10;
	const radius = 50;
	const circumference = 2 * Math.PI * radius;

	return (
		<div className="relative h-16 w-16">
			<svg className="absolute top-0 left-0 -rotate-90 transform" width="100%" height="100%" viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`} xmlns="http://www.w3.org/2000/svg">
				<circle className="text-gray-400" stroke="currentColor" strokeWidth={strokeWidth} fill="none" cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius} />
				<circle className="text-white transition-all duration-300 ease-in-out" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={((100 - progress) / 100) * circumference} strokeLinecap="round" fill="none" cx={radius + strokeWidth} cy={radius + strokeWidth} r={radius} />
			</svg>
			<div className="absolute top-0 left-0 flex h-full w-full items-center justify-center text-xs text-white">
				{Math.round(progress)}%
			</div>
		</div>
	);
}

const Input: React.FC<InputProps> = ({ parent, setParent }) => {
	const { edgestore } = useEdgeStore();
	const [text, setText] = useState('');
	const { user } = useUser();
	const [fileStates, setFileStates] = useState<FileState[]>([]);
	const [urls, setUrls] = useState<string[]>([]);
	
	const imageUrls = React.useMemo(() => {
		if (fileStates) {
			console.log(fileStates.length);
			return fileStates.map((fileState) => {
				if (typeof fileState.file === 'string') return fileState.file;
				else return URL.createObjectURL(fileState.file);
			});
		}
		return [];
	}, [fileStates]);

	const { getRootProps, getInputProps } = useDropzone({
		accept: { 'image/*': [] },
		onDrop: (acceptedFiles) => {
			const files = acceptedFiles;
			if (files) {
				const addedFiles = files.map<FileState>((file) => ({
					file,
					key: Math.random().toString(36).slice(2),
					progress: 'PENDING',
				}));
				handleAttachmentChange(addedFiles);
			}
		},
		maxFiles: 6
	});

	function updateFileProgress(key: string, progress: FileState['progress']) {
		setFileStates((fileStates) => {
			const newFileStates = structuredClone(fileStates);
			const fileState = newFileStates.find(
				(fileState) => fileState.key === key,
			);
			if (fileState) {
				fileState.progress = progress;
			}
			return newFileStates;
		});
	}

	const handleAttachmentChange = async (addedFiles: FileState[]) => {
		setFileStates([...fileStates, ...addedFiles]);
		await Promise.all(
			addedFiles.map(async (addedFileState) => {
				try {
					const file = addedFileState.file;

					if (file instanceof File) {
						const res = await edgestore.publicFiles.upload({
							file: file,
							onProgressChange: async (progress) => {
								updateFileProgress(addedFileState.key, progress);
								if (progress === 100) {
									await new Promise((resolve) => setTimeout(resolve, 1000));
									updateFileProgress(addedFileState.key, 'COMPLETE');
								}
							},
						});
						setUrls((prevUrls) => [...prevUrls, res.url]);
					} else console.error('Expected a File, but received:', file);
				} catch (err) {
					updateFileProgress(addedFileState.key, 'ERROR');
					console.error(err);
				}
			})
		);
	}

	const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const textarea = event.target;
		setText(textarea.value);

		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	const createPost = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!user || !(text || urls.length)) return;

		const data = {
			parent,
			author: user._id,
			text,
			attachments: urls
		}

		api.post('/posts', data)
			.then(response => {
				setText('');
				setFileStates([]);
				setParent((prevPosts) => [...prevPosts, response.data]);
			}).catch(error => console.log(error));
	}


	return <>
		{user &&
			<form onSubmit={createPost} className="flex flex-col border border-foreground p-3">
				<textarea name="text" placeholder="text" value={text} onChange={handleTextChange} className="bg-transparent resize-none overflow-hidden" />

				<div className={`flex ${fileStates.length > 1 ? 'justify-between' : 'justify-end'} gap-3 items-end`}>
					{fileStates.length > 1 &&
						<div className="flex gap-3">
							{fileStates?.map(({ file, progress }, index) => (
								<div key={index} className={'p-0 h-16 w-16 relative shadow-md rounded-md aspect-square'}>
									<img className="h-full w-full rounded-md object-cover" src={imageUrls[index]} alt={typeof file === 'string' ? file : file.name} />
									{/* Progress Bar */}
									{typeof progress === 'number' && (
										<div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-black bg-opacity-70">
											<CircleProgress progress={progress} />
										</div>
									)}
									{/* Remove Image Icon */}
									{imageUrls[index] && progress === "COMPLETE" && (
										<div className="w-full h-full group absolute right-0 top-0 flex justify-center items-center
											bg-transparent hover:bg-black/75 cursor-pointer transition-all duration-250 rounded-md"
											onClick={(event) => {
												event.stopPropagation();
												setFileStates((prevFileStates) => prevFileStates.filter((_, i) => i !== index));
											}} >
											<DeleteIcon
												classNames="opacity-0 group-hover:opacity-100 transition-all duration-250 rounded-md"
											/>
										</div>
									)}
								</div>
							))}
						</div>
					}
					<div className="flex gap-3">
						{(!fileStates || fileStates.length < 6) && (
							<div {...getRootProps({ className: `relative cursor-pointer` })}>
								<input {...getInputProps()} />
								<ImageIcon classNames="hover:opacity-50 transition-all duration-250" />
							</div>
						)}
						<button type="submit"><SendIcon /></button>
					</div>
				</div>
			</form>
		}
	</>;
}

export default Input