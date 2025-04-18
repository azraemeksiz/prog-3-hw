export interface Pet {
	id: number;
	name: string;
	hunger: number;
	happiness: number;
	type: string;       
	adopted: boolean;
	ownerId: number;   //added more functionalities to pets such as hunger type etc
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
