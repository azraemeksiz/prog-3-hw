<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';


	let name = '';
	let type = 'puppy';
	$: user = $currentUser;


	import { get } from 'svelte/store';

	onMount(() => {
	const interval = setInterval(() => {
		const u = get(currentUser);
		if (u) {
			if (u.role !== 'admin') {
				goto('/');
			}
			clearInterval(interval);
		}
	}, 100);
});





	async function addPet() {
		const res = await fetch('/api/pets', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, type })
	});

	if (res.ok) {
		alert('Pet successfully added!');
		name = '';
	} else {
		alert('Failed to add pet.');
	}

		
	}
</script>

<h1>Add a New Pet</h1>

<form on:submit|preventDefault={addPet}>

	<label>
		Pet Name:
		<input bind:value={name} required />
	</label>

	<label>
		Pet Type:
		<select bind:value={type}>
			<option value="puppy">Puppy</option>
			<option value="kitten">Kitten</option>
		</select>
	</label>

	<button type="submit">Add Pet</button>
</form>


<style>
    form {
        display: grid;
        gap: 0.75rem;
        max-width: 300px;
    }
</style>
