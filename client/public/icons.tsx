interface IconProps {
	classNames?: string;
}

export function CommentIcon({ classNames }: IconProps) {
	return <svg className={`${classNames}`} fill="#ffffff" width="1.25em" height="1.25em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 14h.5c.827 0 1.5-.673 1.5-1.5v-9c0-.827-.673-1.5-1.5-1.5h-13C2.673 2 2 2.673 2 3.5V18l5.333-4H16zm-9.333-2L4 14V4h12v8H6.667z"/><path d="M20.5 8H20v6.001c0 1.1-.893 1.993-1.99 1.999H8v.5c0 .827.673 1.5 1.5 1.5h7.167L22 22V9.5c0-.827-.673-1.5-1.5-1.5z"/></svg>
}

export function LikeIcon({ classNames }: IconProps) {
	return <svg className={`${classNames}`} fill="#ffffff" width="1.25em" height="1.25em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"/></svg>
}

export function RepostIcon({ classNames }: IconProps) {
	return <svg className={`${classNames}`} fill="#ffffff" width="1.25em" height="1.25em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"/></svg>
}

export function ShareIcon({ classNames }: IconProps) {
	return <svg className={`${classNames}`} fill="#ffffff" width="1.25em" height="1.25em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 16h2V7h3l-4-5-4 5h3z"/><path d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z"/></svg>
}

export function DeleteIcon({ classNames }: IconProps) {
	return <svg className={`${classNames}`} fill="#ffffff" width="1.25em" height="1.25em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"/><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"/></svg>
}

export function ImageIcon({ classNames }: IconProps) {
	return <svg className={`${classNames}`} fill="#ffffff" width="1.25em" height="1.25em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"/><path d="m10 14-1-1-3 4h12l-5-7z"/></svg>
}

export function SendIcon({ classNames }: IconProps) {
	return <svg className={`${classNames}`} fill="#ffffff" width="1.25em" height="1.25em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="m16.589 9-1.586-1.586-9.097 9.097-.529 2.114 2.114-.528zm2.999-3-1.586 1.586L16.416 6l1.586-1.586z"/><path d="M4.003 21c.081 0 .162-.01.242-.03l4-1c.176-.044.337-.135.465-.263L21.003 7.414c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414L19.417 3c-.756-.756-2.072-.756-2.828 0L4.296 15.293a1.003 1.003 0 0 0-.263.464l-1 4A1 1 0 0 0 4.003 21zm14-16.586L19.589 6l-1.586 1.586L16.417 6l1.586-1.586zM5.906 16.511l9.097-9.097L16.589 9l-9.098 9.097-2.114.528.529-2.114z"/></svg>
}

// export function Icon({ classNames }: IconProps) {
// 	return
// }