<script lang="ts">
	import type { PageData } from './$types';
	import type { Record } from '$lib/types';

	export let data: PageData;

	const records: Record[] = JSON.parse(data.records);
</script>

<hx1>Zone {data.zone}</hx1>
<h2>Your Records</h2>
<form method="post" action="?/save">
	{#each records as record}
		<div class="record">
			<input
				type="text"
				name="name-{record.id}"
				id="name-{record.id}"
				value={record.name}
				required
			/>
			<textarea name="content-{record.id}" id="content-{record.id}" cols="30" rows="10"
				>{record.content}</textarea
			>
			<input type="hidden" name="id" value={record.id} />
		</div>
	{/each}
	<button type="submit">Save</button>
</form>

<form action="?/new" method="post">
	<label for="name">Record Name</label>
	<input type="text" name="name" id="name" required />
	<label for="content">Record Content</label>
	<textarea name="content" id="content" cols="30" rows="10"></textarea>
	<button type="submit">Add</button>
</form>
