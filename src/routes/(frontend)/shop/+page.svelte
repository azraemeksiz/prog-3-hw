<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { invalidate } from '$app/navigation';

	$: user = $currentUser;

	async function buy(item: 'food' | 'toy' | 'treat') {
		if (!user) {
			alert('You must be logged in to buy items.');
			return;
		}

		const res = await fetch('/api/shop', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: user.id, item }) 
		});

		if (res.ok) {
		const updatedUser = await res.json();
		currentUser.set(updatedUser); 
		alert(`You bought one ${item}!`);
	} else {
			alert('Purchase failed.');
		}
		
	}
</script>

<h1>Pet Shop</h1>

{#if user}
<p>Budget: ${user.budget}</p> 

<h3>🎒 Inventory</h3>
	<ul>
		<li>Food: {user.inventory.food}</li>
		<li>Toy: {user.inventory.toy}</li>
		<li>Treat: {user.inventory.treat}</li>
	</ul>

	<h3>🛍 Buy Items</h3>
	<button on:click={() => buy('food')}>Buy Food ($5)</button>

	<button on:click={() => buy('toy')}>Buy Toy ($10)</button>
	
	<button on:click={() => buy('treat')}>Buy Treat ($15)</button>
{:else}
	<p>You must be logged in to use the shop.</p>
{/if}



<style>
	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		margin-bottom: 0.5rem;
	}

    button {
        padding: 0.5rem;
        font-size: 1rem;
		margin: 0.5rem;
    }
</style>
