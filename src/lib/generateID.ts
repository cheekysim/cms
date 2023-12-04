export const generateID = (currentIDs: string[], length: number = 12): string => {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ?-_';
	let r = '';
	for (let i = 0; i < length; i++) {
		r += chars[Math.floor(Math.random() * chars.length)];
	}
	if (currentIDs.includes(r)) r = generateID(currentIDs, length);
	return r;
};
