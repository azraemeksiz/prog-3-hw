import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import { readFile } from 'fs/promises';
import type { FullUser, SafeFullUser } from '$lib/types';

const usersPath = path.resolve('static/data/users.json'); //data path to users

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json(); 

	const file = await readFile(usersPath, 'utf-8');
	const users: FullUser[] = JSON.parse(file); 

	const user = users.find((u) => u.name === name); 
	if (!user) {
		return new Response(JSON.stringify({ message: 'User not found' }), {
			status: 401
		});
	}

	const passwordMatch = await bcrypt.compare(password, user.passwordHash); //compares password with hashed password

	console.log("Found user:", user); //added later for check
    console.log("Password match:", passwordMatch);


	if (!passwordMatch) {
		return new Response(JSON.stringify({ message: 'Invalid password' }), {
			status: 401
		});
	}

	const safeUser: SafeFullUser = {
		id: user.id,
		name: user.name,
		budget: user.budget,
		inventory: user.inventory,
		role: user.role
	
	}; 

	return new Response(JSON.stringify(safeUser), { status: 200 }); 
};
