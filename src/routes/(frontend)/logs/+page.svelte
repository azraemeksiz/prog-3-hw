<script lang="ts">
	import { onMount } from 'svelte';
	let logs: string[] = [];
	let error = '';

	onMount(async () => {
		try { 
			const res = await fetch('/api/log');
			if (!res.ok) throw new Error('Failed to fetch logs');
			const data = await res.json();
			logs = data.reverse(); //push newer to up

		}
		catch (err) { error = 'Failed to load logs.';}
	});

</script>

<h1>Action Log</h1>

{#if error}
    <p style="color: red;">{error}</p>
{:else if logs.length === 0}
    <p>No actions have been logged yet.</p>
{:else}
<ul>
	{#each logs as log}
		<li>{log}</li>
	{/each}
</ul>

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
		padding: 0.5rem 0;
		border-bottom: 1px solid #d34ce2;
	}
</style>
