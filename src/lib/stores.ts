import { writable } from 'svelte/store';
import type { SafeFullUser } from './types';


// This store should always hold the currently logged-in user (without passwordHash)
export const currentUser = writable<SafeFullUser | null>(null);
