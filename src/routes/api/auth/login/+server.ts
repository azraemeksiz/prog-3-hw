import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import { readFile } from 'fs/promises';
import type { FullUser, SafeFullUser } from '$lib/types';

const usersPath = path.resolve('static/data/users.json'); //data path to users

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json(); //extracts name and password from json request

	const file = await readFile(usersPath, 'utf-8');
	const users: FullUser[] = JSON.parse(file); //reads the users as string 

	const user = users.find((u) => u.name === name); //finds users
	if (!user) {
		return new Response(JSON.stringify({ message: 'User not found' }), {
			status: 401
		});
	}

	const passwordMatch = await bcrypt.compare(password, user.passwordHash); //compares password with hashed password
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
	
	}; //creates a safe version of the user without password

	return new Response(JSON.stringify(safeUser), { status: 200 }); //turn into string then send
};
