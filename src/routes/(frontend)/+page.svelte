<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pet } from '$lib/types';

	
	let pets: Pet[] = [];
	let petType: '' | 'puppy' | 'kitten' = '';

	async function loadPets() {
		const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
		pets = await res.json();
	}

	async function adopt(petId: number) {
        // TODO only let the user adopt if they are signed in.
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
