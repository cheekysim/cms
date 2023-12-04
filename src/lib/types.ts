type User = {
	id: string;
	username: string;
	role: 'admin' | 'user';
};

type Zone = {
	id: string;
	name: string;
	user: string;
};

type Record = {
	id: string;
	name: string;
	type: string;
	content: string;
	zone: string;
};

export type { User, Zone, Record };
