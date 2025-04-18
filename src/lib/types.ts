

export interface Pet {
	name: string;
}

export interface User {
	id: number;
	name: string;
	passwordHash: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;

//extending users so they can have other attributes
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
