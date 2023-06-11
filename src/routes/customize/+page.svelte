<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Node } from 'commonmark';
	import { templateReducible } from '../htmlTemplate.store';
	import type { BooleanRowItem, JoinedRowItem, NewRowItem, StringRowItem } from '../rows.types';
	import CustomNode from './CustomNode.svelte';
	import InsertButtons from './InsertButtons.svelte';

	let parsedNode: Node;
	let fullRowItems: Readonly<JoinedRowItem[]>;
	let markdownText = '';
	let htmlText = '';

	const { dispatch, subscribe } = templateReducible();

	subscribe((value) => {
		parsedNode = value.node;
		markdownText = value.markdown;
		htmlText = value.html;
		fullRowItems = value.rows;
	});

	function insertRow(location: number) {
		const newRow: NewRowItem = {
			type: 'new',
			value: ''
		};
		const newRows = [...fullRowItems];
		newRows.splice(location, 0, newRow);

		fullRowItems = [...newRows];
	}

	function cancelItem(location: number) {
		const newRows = [...fullRowItems];
		newRows.splice(location, 1);

		fullRowItems = [...newRows];
	}

	function removeItem(location: number) {
		dispatch({
			type: 'remove',
			location
		});
	}

	function addRow(location: number, item: BooleanRowItem | StringRowItem) {
		dispatch({
			type: 'rows',
			value: item,
			location
		});
	}

	// TODO: Move this "routing" onto button "base" html
	function routeToFill() {
		goto('/fill');
	}
	function routeToFillMarkdown() {
		goto('/fill/markdown');
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<button on:click|preventDefault={routeToFill} class="btn variant-ringed">
		Fill made template
	</button>
	<button on:click|preventDefault={routeToFillMarkdown} class="btn variant-ringed">
		Edit as markdown
	</button>

	<ul class="list">
		{#each fullRowItems as fullRowItem, i}
			<li>
				{#if fullRowItem.type === 'boolean'}
					{@html fullRowItem.text}
					<InsertButtons index={i} clickAction={insertRow} totalLength={fullRowItems.length} />
				{:else if fullRowItem.type === 'string'}
					{@html fullRowItem.value}
					<InsertButtons index={i} clickAction={insertRow} totalLength={fullRowItems.length} />
				{:else if fullRowItem.type === 'new'}
					{@html fullRowItem.value}
					<CustomNode location={i} {addRow} cancelAdd={cancelItem} />
				{:else}
					{@html fullRowItem.value}
					<InsertButtons index={i} clickAction={insertRow} totalLength={fullRowItems.length} />
				{/if}

				{#if fullRowItem.type !== 'new'}
					<button class="btn btn-sm variant-ringed-warning" on:click|preventDefault={() => removeItem(i)}>
						Remove
					</button>
				{/if}
			</li>
		{/each}
	</ul>
	<br />
	{@html htmlText}
</div>
