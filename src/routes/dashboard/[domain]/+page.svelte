<script lang="ts">
	import type { PageData } from './$types';
	import type { Record } from '$lib/types';
	import type { MouseEventHandler } from 'svelte/elements';

	export let data: PageData;

	let type = 'text';

	const records: Record[] = JSON.parse(data.records);

	const deleteRecord: (id: string) => MouseEventHandler<HTMLButtonElement> = (id) => async (e) => {
		e.preventDefault();
		const record = document.getElementById(`record-${id}`);
		record?.remove();
	};
</script>

<hx1>Domain {data.domain}</hx1>
<h2>Your Records</h2>
<form method="post" action="?/save" style="max-width: 100vw;">
	<div>
		{#each records as record}
			<div id="record-{record._id}" class="record" style="display: inline-block; margin: 0 1rem;">
				<input
					type="text"
					name="name-{record._id}"
					id="name-{record._id}"
					value={record.name}
					required
					style="display: inline;"
				/>
				<button class="delete-record" on:click={deleteRecord(record._id)} style="display: inline;"
					>X</button
				>
				<input
					type="text"
					name="type-{record._id}"
					id="type-{record._id}"
					value={record.type}
					hidden
					aria-hidden="true"
				/>
				{#if record.type === 'quote' && record.content}
					<input
						type="text"
						name="title-{record._id}"
						id="title-{record._id}"
						value={JSON.parse(record.content).title}
						required
						style="display: block;"
					/>
					<textarea
						name="content-{record._id}"
						id="content-{record._id}"
						cols="30"
						rows="10"
						style="display: block;">{JSON.parse(record.content).content}</textarea
					>
				{:else}
					<textarea
						name="content-{record._id}"
						id="content-{record._id}"
						cols="30"
						rows="10"
						style="display: block;">{record.content}</textarea
					>
				{/if}
				<input type="hidden" name="id" value={record._id} />
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
		<label for="type">Record Type</label>
		<select name="type" id="type" required style="display: block;" bind:value={type}>
			<option value="text">Text</option>
			<option value="quote">Quote</option>
		</select>
		{#if type === 'quote'}
			<label for="title">Quote Title</label>
			<input type="text" name="title" id="title" required style="display: block;" />
		{/if}
		<label for="content" style="display: block;">Record Content</label>
		<textarea name="content" id="content" cols="30" rows="10" required></textarea>
	</div>
	<button type="submit">Add</button>
</form>
