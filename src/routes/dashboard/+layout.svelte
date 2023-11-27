<script lang="ts">
	import type { LayoutData } from './$types';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';

	export let data: LayoutData;

	const logout = () => {
		user.update(() => ({ username: 't', password: 'e', role: 'user' }));
	};
</script>

{#if data.isAdmin}
	<h1>Hello, {data.username} | Admin Dashboard</h1>
{:else}
	<h1>Hello, {data.username}!</h1>
{/if}

<button type="button" on:click={logout}>Logout</button>

<slot />
