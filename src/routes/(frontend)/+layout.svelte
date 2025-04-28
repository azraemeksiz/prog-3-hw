<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { goto } from '$app/navigation';

	$: user = $currentUser;

	function logout() {
		currentUser.set(null);
		goto('/login');
	}
</script>

<nav>
    <a href="/">Home</a>
    {#if user}
        <a href="/dashboard">Dashboard</a>
        <a href="/logs">Logs</a>
        <a href="/shop">Shop</a>

<!--        if the user is an administrator add a button here that redirects the user to /admin-->
           {#if user.role === 'admin'} 
           <button on:click={() => goto('/admin')}>Admin</button>
           {/if}


        <button on:click={logout}>Logout</button>
        <span class="user">{user.name}</span>
    {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    {/if}
</nav>

<slot />

<style>
    nav {
        background: #f09ce9;
        padding: 1rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        border-bottom: 1px solid #b72ca0;
    }

    nav a {
        text-decoration: none;
        color: #91237e;
    }

    nav .user {
        margin-left: auto;
        font-weight: bold;
    }

    nav button {
        background: transparent;
        border: none;
        cursor: pointer;
        color: #a1246b;
    }

    nav button:hover {
        text-decoration: underline;
    }
</style>
