<script lang="ts">
  import { goto } from '$app/navigation'; //navigate users to dashboard
  import { currentUser } from '$lib/stores'; //store users in storage
  import { invalidate } from '$app/navigation'; //keep information fresh

  let name = '';
  let password = '';
  let error = '';

  async function handleLogin() {
    
    console.log("Trying login with", name, password); //check

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });

    if (!res.ok) {
      error = 'Invalid name or password. Please try again.';
      return;
    }

    const user = await res.json();
    currentUser.set(user);
    await invalidate('currentUser');
    goto('/dashboard');
  }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={handleLogin}>
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

  <button type="submit">Login</button>
</form>

{#if error}
  <p style="color: red;">{error}</p>
{/if}
