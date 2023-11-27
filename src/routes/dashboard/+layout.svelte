<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

{#if data.isAdmin}
	<h1>Hello, {data.username} | Admin Dashboard</h1>
{:else}
	<h1>Hello, {data.username}!</h1>
{/if}
<slot />
