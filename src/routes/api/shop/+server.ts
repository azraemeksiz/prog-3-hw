import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import type { FullUser } from '$lib/types';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { userId, item } = await request.json();
	const file = await readFile(usersPath, 'utf-8');
	const users: FullUser[] = JSON.parse(file);

	const user = users.find(u => u.id === userId);
	if (!user) {
		return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
	}


	let cost = 0;
	switch (item) {
		case 'food':
			cost = 5;
			break;
		case 'toy':
			cost = 10;
			break;
		case 'treat':
			cost = 15;
			break;
		default:
			return new Response(JSON.stringify({ message: 'Invalid item' }), { status: 400 });
	}

	if (user.budget < cost) {
		return new Response(JSON.stringify({ message: 'Not enough budget' }), { status: 400 });
	}

	
user.budget = user.budget - cost;

if (item === 'food') {
	user.inventory.food = user.inventory.food + 1;
} else if (item === 'toy') {
	user.inventory.toy = user.inventory.toy + 1;
} else if (item === 'treat') {
	user.inventory.treat = user.inventory.treat + 1;
}


	await writeFile(usersPath, JSON.stringify(users, null, 2));

	const { passwordHash, ...safeUser } = user;
return new Response(JSON.stringify(safeUser), { status: 200 });


};

