import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import type { FullUser, Pet } from '$lib/types';


const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');
const logPath = path.resolve('static/data/log.json');

export const POST: RequestHandler = async ({ request }) => {
	const { userId, petId, action } = await request.json();

	const [userFile, petFile, logFile] = await Promise.all([
		readFile(usersPath, 'utf-8'),
		readFile(petsPath, 'utf-8'),
		readFile(logPath, 'utf-8')
	]);

	const users: FullUser[] = JSON.parse(userFile);
	const pets: Pet[] = JSON.parse(petFile);
	const logs: string[] = JSON.parse(logFile);

	const user = users.find(u => u.id === userId);
	const pet = pets.find(p => p.id === petId && p.ownerId === userId);

	if (!user || !pet) {
		return new Response(JSON.stringify({ message: 'User or Pet not found' }), { status: 404 });
	}

	switch (action) {
		case 'feed':
			if (user.inventory.food > 0) {
				user.inventory.food -= 1;
			} else if (user.budget >= 5) {
				user.budget -= 5;
			} else {
				return new Response(JSON.stringify({ redirect: '/shop' }), { status: 400 });
			}
			pet.hunger = Math.max(0, pet.hunger - 20);
			logs.push(`${user.name} fed ${pet.name} (-$5)`);
			break;

		case 'toy':
			if (user.inventory.toy > 0) {
				user.inventory.toy -= 1;
			} else if (user.budget >= 10) {
				user.budget -= 10;
			} else {
				return new Response(JSON.stringify({ redirect: '/shop' }), { status: 400 });
			}
			pet.happiness = Math.min(100, pet.happiness + 30);
			logs.push(`${user.name} played with ${pet.name} (-$10)`);
			break;

		case 'return':
			pet.adopted = false;
			pet.ownerId = null;
			user.budget -= 20;
			logs.push(`${user.name} returned ${pet.name} (-$20)`);
			break;

		default:
			return new Response(JSON.stringify({ message: 'Invalid action' }), { status: 400 });
	}

	await Promise.all([
		writeFile(usersPath, JSON.stringify(users, null, 2)),
		writeFile(petsPath, JSON.stringify(pets, null, 2)),
		writeFile(logPath, JSON.stringify(logs, null, 2))
	]);

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
