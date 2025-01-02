'use client';

import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { DeleteIcon, ImageIcon } from '../../public/icons';

export type FileState = {
	file: File | string;
	key: string;
	progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
};

type InputProps = {
	className?: string;
	value?: FileState[];
	onChange?: (files: FileState[]) => void | Promise<void>;
	onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
	disabled?: boolean;
	dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
};

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

const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(({ dropzoneOptions, value, disabled, onChange, onFilesAdded }, ref) => {

	const imageUrls = React.useMemo(() => {
		if (value) {
			return value.map((fileState) => {
				if (typeof fileState.file === 'string') return fileState.file;
				else return URL.createObjectURL(fileState.file);
			});
		}
		return [];
	}, [value]);

	// dropzone configuration
	const { getRootProps, getInputProps } = useDropzone({
		accept: { 'image/*': [] },
		disabled,
		onDrop: (acceptedFiles) => {
			const files = acceptedFiles;
			if (files) {
				const addedFiles = files.map<FileState>((file) => ({
					file,
					key: Math.random().toString(36).slice(2),
					progress: 'PENDING',
				}));
				void onFilesAdded?.(addedFiles);
				void onChange?.([...(value ?? []), ...addedFiles]);
			}
		},
		...dropzoneOptions,
	});

	return (
		<div className='border-white border-b border-l border-r p-3'>
			<div className={`flex justify-between gap-3 items-end`}>
				{/* Dropzone */}
				{(!value || value.length < (dropzoneOptions?.maxFiles ?? 0)) && (
					<div {...getRootProps({ className: `relative cursor-pointer` })}>
						<input ref={ref} {...getInputProps()} />
						<ImageIcon classNames="hover:opacity-50 transition-all duration-250" />
					</div>
				)}

				{/* Images */}
				{value?.map(({ file, progress }, index) => (
					<div key={index} className={'border p-0 h-16 w-16 relative shadow-md rounded-md aspect-square'}>
						<img className="h-full w-full rounded-md object-cover" src={imageUrls[index]} alt={typeof file === 'string' ? file : file.name} />
						{/* Progress Bar */}
						{typeof progress === 'number' && (
							<div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-black bg-opacity-70">
								<CircleProgress progress={progress} />
							</div>
						)}
						{/* Remove Image Icon */}
						{imageUrls[index] && !disabled && progress === "COMPLETE" && (
							<div className="w-full h-full group absolute right-0 top-0 flex justify-center items-center
								bg-transparent hover:bg-black/75 cursor-pointer transition-all duration-250 rounded-md"
								onClick={(e) => {
									e.stopPropagation();
									void onChange?.(value.filter((_, i) => i !== index) ?? []);
								}} >
								<DeleteIcon
									classNames="opacity-0 group-hover:opacity-100 transition-all duration-250 rounded-md"
								/>
							</div>

						)}
					</div>
				))}
			</div>
		</div>
	);
},
);

MultiImageDropzone.displayName = 'MultiImageDropzone';