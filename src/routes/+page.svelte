<script>
	import { goto } from '$app/navigation';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button type="button" on:click={() => goto('/login')}>Login</button>
