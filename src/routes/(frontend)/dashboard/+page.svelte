<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import type { Pet } from '$lib/types';
	import { goto } from '$app/navigation';
  
	let pets: Pet[] = [];
	let error = '';
	let success = '';
  
	$: user = $currentUser;
  
	async function loadPets() {
	  
		pets = [
	{ id: 1, name: 'Leon', type: 'puppy', hunger: 50, happiness: 70, adopted: true, ownerId: 1 },
	{ id: 2, name: 'Mathilda', type: 'kitten', hunger: 30, happiness: 80, adopted: true, ownerId: 1 }
];

	}
  
	async function handleAction(petId: number, action: 'feed' | 'toy' | 'return') {
	  switch (action) {
		case 'feed':
		  const pet = pets.find(p => p.id === petId);
		  if (pet) {
			pet.hunger -= 20;
			success = `${pet.name} has been fed!`;
		  }
		  break;
		case 'toy':
		  const petForToy = pets.find(p => p.id === petId);
		  if (petForToy) {
			petForToy.happiness += 30;
			success = `${petForToy.name} played with a toy!`;
		  }
		  break;
		case 'return':
		  const index = pets.findIndex(p => p.id === petId);
		  if (index !== -1) {
			const removedPet = pets.splice(index, 1);
			success = `${removedPet[0].name} has been returned.`;
		  }
		  break;
	  }
	}
  
	onMount(() => {
	  if (!user) {
		goto('/login');
	  } else {
		loadPets();
	  }
	});
  </script>
  
  <h1>📋 Your Adopted Pets</h1>
  
  {#if success}<p style="color: green;">{success}</p>{/if}
  {#if error}<p style="color: red;">{error}</p>{/if}
  
  {#if pets.length === 0}
	  <p>You haven’t adopted any pets yet.</p>
  {:else}
	  <div>
		  {#each pets as pet}
			  <div>
				  <h3>{pet.name} ({pet.type})</h3>
				  <p>Hunger: {pet.hunger}</p>
				  <p>Happiness: {pet.happiness}</p>
				  <button on:click={() => handleAction(pet.id, 'feed')}>Feed</button>
				  <button on:click={() => handleAction(pet.id, 'toy')}>Play with Toy</button>
				  <button on:click={() => handleAction(pet.id, 'return')}>Return Pet</button>
			  </div>
		  {/each}
	  </div>
  {/if}
  
  <style>
	/* I will add some design later */
  </style>
  