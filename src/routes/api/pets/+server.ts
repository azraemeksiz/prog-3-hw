import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import type { Pet } from '$lib/types';

const petsPath = path.resolve('static/data/pets.json'); 

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');

	const file = await readFile(petsPath, 'utf-8'); 
	const pets: Pet[] = JSON.parse(file);

	const filteredPets = type ? pets.filter(pet => pet.type === type) : pets; //if it has a type, filter 

	return new Response(JSON.stringify(filteredPets), { status: 200 }); //I edited the get part
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { name, type } = body;

	const file = await readFile(petsPath, 'utf-8');
	const pets: Pet[] = JSON.parse(file);
	const newPet: Pet = {

		id: Math.max(0, ...pets.map(p => p.id)) + 1, //adds 1 to pets ID part
		name,
		type,
		hunger: 50,
		happiness: 60,
		adopted: false,
		ownerId: -50
	};

	pets.push(newPet);
	await writeFile(petsPath, JSON.stringify(pets, null, 2));

	return new Response(JSON.stringify({ success: true }), { status: 201 });
};

// TODO: Handle GET and POST requests for pets
