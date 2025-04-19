import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import type { Pet } from '$lib/types';

const petsPath = path.resolve('static/data/pets.json');
const usersPath = path.resolve('static/data/users.json');

//pets can be adopted only once 
export const POST: RequestHandler = async ({ request }) => {
	const { userId, petId } = await request.json();

	const file = await readFile(petsPath, 'utf-8');
	const pets: Pet[] = JSON.parse(file);

	const pet = pets.find(p => p.id === petId); 

	if (!pet || pet.adopted) {
	
	return new Response(JSON.stringify({ message: 'Pet not available' }), { status: 400 });

};

pet.adopted = true; //if adopted assign pet owner id and user id
pet.ownerId = userId;

await writeFile(petsPath, JSON.stringify(pets, null, 2)); 

	return new Response(JSON.stringify({ success: true }), { status: 200 });
};