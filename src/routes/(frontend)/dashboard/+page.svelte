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
	  
		try {
    const res = await fetch('/api/pets'); //Now it is taking the data from the JSON file 
    if (!res.ok) throw new Error('Failed to load pets');

    const allPets: Pet[] = await res.json();
    pets = allPets.filter((p) => p.adopted && p.ownerId === user?.id); //this part checks the owner 
  } catch (err) {
    error = 'Error loading pets.';
  }
}
  



	async function handleAction(petId: number, action: 'feed' | 'toy' | 'return') {
  if (!user) return;

  try {
    const response = await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, petId, action })
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.redirect) {
        goto(result.redirect);
      } else {
        error = result.message || 'Something went wrong.';
      }
      return;
    }

    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    if (action === 'feed') {
      pet.hunger = Math.max(0, pet.hunger - 20);
      success = `${pet.name} has been fed!`;
    } else if (action === 'toy') {
      pet.happiness = Math.min(100, pet.happiness + 30);
      success = `${pet.name} played with a toy!`;
    } else if (action === 'return') {
      pets = pets.filter(p => p.id !== petId);
      success = `${pet.name} has been returned.`;
    }
  } catch (err) {
    error = 'Failed to perform action.';
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
  