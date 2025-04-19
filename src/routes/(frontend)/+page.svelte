
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pet } from '$lib/types';
	import { currentUser } from '$lib/stores';

	
	let pets: Pet[] = [];
	let petType: '' | 'puppy' | 'kitten' = '';

	$: user = $currentUser; //follow the user

	async function loadPets() {
		const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
		pets = await res.json();
	} //update the pet list

	async function adopt(petId: number) {
		if (!user) {
			alert('You must be logged in to adopt a pet.');
			return;
		} 

			const res = await fetch('/api/adopt', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: user.id, petId })
		});

		if (res.ok) {
			alert('Pet successfully adopted!');
			await loadPets(); //update pet list
		} else {
			alert('Failed to adopt pet.');
		}
	}

	
		
	onMount(loadPets);

</script>

<h1>Browse Adoptable Pets</h1>

{#if pets.length === 0}
    <p>No pets available.</p>
{:else}

<ul>
	{#each pets as pet (pet.id)}
		<li>
			<strong>{pet.name}</strong> ({pet.type}) - 
			{pet.adopted ? 'Adopted' : 'Available'}
			{#if !pet.adopted}
				<button on:click={() => adopt(pet.id)}>Adopt</button>
			{/if}
		</li>
	{/each}
</ul>
{/if}
		

<style>
</style>
