<script lang="ts">
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	export let data: LayoutData;
</script>

{#if data.isAdmin}
	<h1>Hello, {data.username} | Admin Dashboard</h1>
{:else}
	<h1>Hello, {data.username}!</h1>
{/if}

<button type="button" on:click={() => goto('/logout')}>Logout</button>

<slot />
