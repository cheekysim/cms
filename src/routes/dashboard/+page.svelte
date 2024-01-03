<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
</script>

<h1>Your Zones</h1>
{#each data.zones as zone}
	<h2>{zone.name}</h2>
	<button type="button" on:click={() => goto(`/dashboard/${zone._id}`)}>Manage</button>
{/each}
