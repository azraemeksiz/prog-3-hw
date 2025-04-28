<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import type { Pet } from '$lib/types';
	import { goto } from '$app/navigation';
  
	let pets: Pet[] = [];
	let error = '';
	let success = '';
  
	$: user = $currentUser;

  onMount(() => {
	  if (!user) {
		goto('/login');
	  } else {
		loadPets();
	  }
	});
  
	async function loadPets() {
	  
		try {
    const res = await fetch('/api/pets'); 
    if (!res.ok) throw new Error('Failed to load pets');

    const allPets: Pet[] = await res.json();
    pets = allPets.filter((p) => p.adopted && p.ownerId === user?.id); 
  } catch (err) {
    error = 'Error loading pets.';
  }
}
  



	async function handleAction(petId: number, action: 'feed' | 'toy' | 'treat' | 'return') {
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

    currentUser.set(result); //added this because i want the results of hunger and happiness to show up right after feeding or playing 

    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    if (action === 'feed') {
      pet.hunger = Math.max(0, pet.hunger - 20);
      success = `${pet.name} has been fed!`;
    } else if (action === 'toy') {
      pet.happiness = Math.min(100, pet.happiness + 30);
      success = `${pet.name} played with a toy!`;

    } else if (action === 'treat') {
      pet.happiness = Math.min(100, pet.happiness + 15);
      success = `${pet.name} got a treat!`;
      
    } else if (action === 'return') {
      pets = pets.filter(p => p.id !== petId);
      success = `${pet.name} has been returned.`;
    } //shows the logs right up the screen 

    await loadPets(); //refresh the pet list from the server so it shows values right after feeding 

  } catch (err) {
    error = 'Failed to perform action.';
  }
}

  

  
  </script>
  
  <h1>Your Adopted Pets</h1>
  
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
          <button on:click={() => handleAction(pet.id, 'treat')}>Give treat</button>
				  <button on:click={() => handleAction(pet.id, 'return')}>Return Pet</button>
			  </div>
		  {/each}
	  </div>
  {/if}
  
  <style>
	
  </style>
  