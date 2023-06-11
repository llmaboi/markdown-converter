<script lang="ts">
	import { goto } from '$app/navigation';
	import { clipboard } from '@skeletonlabs/skeleton';
	import { templateReducible } from '../htmlTemplate.store';
	import type { JoinedRowItemNotNew } from '../rows.types';

	let rows: Readonly<JoinedRowItemNotNew[]> = [];
	let markdown: Readonly<string>;

	const { dispatch, subscribe } = templateReducible();

	subscribe((val) => {
		// htmlForm = val.html;
		markdown = val.markdown;
		rows = val.rows;
	});

	function routeToEdit() {
		// TODO: Different store...
		// htmlTemplate.set(renderer.render(parsedMarkdownText));
		goto('/customize');
	}

	function updateNode(row: JoinedRowItemNotNew, location: number) {
		if (row.type === 'boolean') {
			dispatch({
				type: 'row',
				location,
				value: {
					...row,
					value: !row.value
				}
			});
		}
		//  else if (row.type === 'string') {
		// 	dispatch({
		// 		type: 'row',
		// 		location,
		// 		value: {
		// 			...row,
		// 			value: row.value
		// 		}
		// 	});
		// }
	}
</script>

<section class="container mx-auto p-8 space-y-8">
	<h1>Fill your template</h1>

	<form>
		{#each rows as row, i}
			{#if row.type === 'boolean'}
				<label class="flex space-x-2">
					<input
						class="checkbox"
						type="checkbox"
						value={row.value}
						on:click={() => updateNode(row, i)}
					/>
					<span>{@html row.text}</span>
				</label>
			{:else if row.type === 'string'}
				<!-- TODO: Allow editing of strings? -->

				{@html row.value}
				<!-- <input class="input" type="text" value={row.value} on:keyup={() => updateNode(row, i)} /> -->
			{:else}
				{@html row.value}
			{/if}
		{/each}

		<button on:click|preventDefault={routeToEdit} class="btn variant-ringed-warning">
			Edit template
		</button>

		<button use:clipboard={markdown} class="btn variant-ringed-success">
			Copy form to clipboard
		</button>
	</form>
</section>
