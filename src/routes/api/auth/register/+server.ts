import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

//path of json file
const usersPath = path.resolve('static/data/users.json');

//using POST to create new user
export const POST: RequestHandler = async ({ request }) => {
  const { name, password } = await request.json();

  //read users from file
  const file = await readFile(usersPath, 'utf-8');
  const users: { name: string; passwordHash: string; budget: number; inventory: { food: number; toy: number; treat: number }; role: string }[] = JSON.parse(file);

  //to check if the username is taken or not
  const existingUser = users.find((user) => user.name === name);
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'Sorry girl, this username is taken :(' }), { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12); //I used 12 salt rounds for medium protection

  //create new user
  const newUser = {
    id: users.length + 1,
    name,
    passwordHash,
    budget: 100,
    inventory: { food: 1, toy: 1, treat: 0 },
    role: 'user'
  };

  
  users.push(newUser);
  await writeFile(usersPath, JSON.stringify(users, null, 2));

  return new Response(JSON.stringify(newUser), { status: 201 });
};
