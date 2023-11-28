type User = {
	id: string;
	username: string;
	role: 'admin' | 'user';
} | null;

type Zone = {
	id: string;
	name: string;
};

export type { User, Zone };
