<script lang="ts">
	import { goto } from '$app/navigation';

	let name = '';
	let password = '';
	let confirmPassword = '';
	let error = '';

	async function handleRegister() {
		if (password !== confirmPassword) {
			error = "Passwords do not match!";
			return;
		}

		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, password })
		});

		const result = await response.json();

		if (!response.ok) {
			
			error = result.message || "An error occurred";
		} else {
			
			goto('/dashboard'); 
		}
	}
</script>

<h1>Register</h1>

<form on:submit|preventDefault={handleRegister}>
	<label>
		Username:
		<input type="text" bind:value={name} required />
	</label>
	<br />
	<br />
	<label>
		Password:
		<input type="password" bind:value={password} required />
	</label>
	<br />
	<br />
	<label>
		Confirm Password:
		<input type="password" bind:value={confirmPassword} required />
	</label>
	<br />
	<br />
	
	<button type="submit">Register</button>
</form>

{#if error}
	<p style="color: red;">{error}</p>
{/if}