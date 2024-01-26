type User = {
	_id: string;
	username: string;
	role: 'admin' | 'user';
};

type Domain = {
	_id: string;
	name: string;
	user: string;
};

type Record = {
	_id: string;
	name: string;
	type: string;
	content: string;
	domain: string;
};

export type { User, Domain, Record };
