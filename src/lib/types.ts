type User = {
	_id: string;
	username: string;
	role: 'admin' | 'user';
};

type Zone = {
	_id: string;
	name: string;
	user: string;
};

type Record = {
	_id: string;
	name: string;
	type: string;
	content: string;
	zone: string;
};

export type { User, Zone, Record };
