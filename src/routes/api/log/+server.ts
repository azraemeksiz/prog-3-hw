import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

//this page only reads logs but i added logs to actions page bc it was easier to push right after

const logPath = path.resolve('static/data/log.json');

export const GET: RequestHandler = async () => {
	try {
		const logs: string[] = JSON.parse(await fs.readFile(logPath, 'utf-8'));
		return new Response(JSON.stringify(logs), { status: 200 });
	} catch (err) {
		return new Response('Failed to read logs.', { status: 500 });
	}
};
