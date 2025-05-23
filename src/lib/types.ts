export interface Pet {
	id: number;
	name: string;
	hunger: number;
	happiness: number;
	type: string;       
	adopted: boolean;
	ownerId: number | null;   
}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
}


export interface FullUser extends User {
	budget: number;
	inventory: {
		food: number;
		toy: number;
		treat: number;
	};
	role: string;
}

export type SafeFullUser = Omit<FullUser, 'passwordHash'>;

