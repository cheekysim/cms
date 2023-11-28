<script>
	import { goto } from '$app/navigation';
</script>

<h1>Cheeky CMS</h1>
<h2>A Private Content Management Solution</h2>
<button type="button" on:click={() => goto('/login')}>Login</button>
