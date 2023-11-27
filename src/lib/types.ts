type User = {
	username: string;
	password: string;
	role: 'admin' | 'user';
} | null;

export type { User };
