<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="login">
	<form method="POST">
		<label for="username">Username</label>
		<input type="text" id="username" name="username" required />

		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />

		{#if form?.status === 401}
			<p class="error">Username or Password is Incorrect.</p>
		{/if}

		<button type="submit">Login</button>
	</form>
</div>
