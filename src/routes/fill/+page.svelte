<script lang="ts">
	import { goto } from '$app/navigation';
	import { templateReducible } from '../htmlTemplate.store';
	import type { JoinedRowItemNotNew } from '../rows.types';

	let rows: Readonly<JoinedRowItemNotNew[]> = [];

	const { dispatch, subscribe } = templateReducible();

	subscribe((val) => {
		// htmlForm = val.html;
		rows = val.rows;
	});

	function routeToEdit() {
		// TODO: Different store...
		// htmlTemplate.set(renderer.render(parsedMarkdownText));
		goto('/customize');
	}

	function updateBooleanNode(row: JoinedRowItemNotNew, location: number) {
		if (row.type == 'boolean') {
			dispatch({
				type: 'row',
				location,
				value: {
					...row,
					value: !row.value
				}
			});
		}
	}
</script>

<section class="container mx-auto p-8 space-y-8">
	<h1>Fill your template</h1>

	<form>
		<ul class="list">
			{#each rows as row, i}
				<li>
					<!-- TODO: Maybe change button into checkbox? -->
					{#if row.type === 'boolean'}
						<!-- TODO: Allow editing of items -- in separate component -->

						<button class="btn" on:click={() => updateBooleanNode(row, i)}>
							{@html row.text}
						</button>
					{:else if row.type === 'string'}
						<!-- TODO: Allow editing of items -->
						{@html row.value}
						<!-- {:else if row.type === 'new'} -->
						<!-- TODO: disallow this -->
						<!-- {null} -->
					{:else}
						<!-- TODO: Allow editing of items -->
						{@html row.value}
					{/if}
				</li>
			{/each}
		</ul>

		<!-- {@html htmlForm} -->

		<!-- TODO: use proper values... -->
		<!-- <button use:clipboard={parsedMarkdownText} class="btn variant-ringed">
			Copy form to clipboard
		</button> -->

		<button on:click|preventDefault={routeToEdit} class="btn variant-ringed">
			Edit template
		</button>
	</form>
</section>
