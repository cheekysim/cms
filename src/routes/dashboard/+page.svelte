<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
</script>

<h1>Your Domains</h1>
{#each data.domains as domain}
	<h2>{domain.name}</h2>
	<button type="button" on:click={() => goto(`/dashboard/${domain._id}`)}>Manage</button>
{/each}
