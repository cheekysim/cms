<script lang="ts">
	import type { PageData } from './$types';
	import type { Record } from '$lib/types';
	import type { MouseEventHandler } from 'svelte/elements';

	export let data: PageData;

	const records: Record[] = JSON.parse(data.records);

	const deleteRecord: (id: string) => MouseEventHandler<HTMLButtonElement> = (id) => async (e) => {
		e.preventDefault();
		const record = document.getElementById(`record-${id}`);
		record?.remove();
	};
</script>

<hx1>Zone {data.zone}</hx1>
<h2>Your Records</h2>
<form method="post" action="?/save" style="max-width: 100vw;">
	<div>
		{#each records as record}
			<div id="record-{record.id}" class="record" style="display: inline-block; margin: 0 1rem;">
				<input
					type="text"
					name="name-{record.id}"
					id="name-{record.id}"
					value={record.name}
					required
					style="display: inline;"
				/>
				<button class="delete-record" on:click={deleteRecord(record.id)} style="display: inline;"
					>X</button
				>
				<textarea
					name="content-{record.id}"
					id="content-{record.id}"
					cols="30"
					rows="10"
					style="display: block;">{record.content}</textarea
				>
				<input type="hidden" name="id" value={record.id} />
			</div>
		{/each}
	</div>
	<button type="submit">Save</button>
</form>

<h2>Add New Record</h2>
<form action="?/new" method="post">
	<div>
		<label for="name">Record Name</label>
		<input type="text" name="name" id="name" required style="display: block;" />
		<label for="content" style="display: block;">Record Content</label>
		<textarea name="content" id="content" cols="30" rows="10"></textarea>
	</div>
	<button type="submit">Add</button>
</form>
