<script lang="ts">
	import type { Node } from 'commonmark';
	import { templateReducible } from '../htmlTemplate.store';
	import CustomNode from './CustomNode.svelte';
	import InsertButtons from './InsertButtons.svelte';
	import type { JoinedRowItem, NewRowItem } from './rows.types';

	// const parser = new Parser();
	// const renderer = new HtmlRenderer();

	let parsedNode: Node;
	let parsedNodes: JoinedRowItem[] = [];
	let markdownText = '';
	let htmlText = '';
	// let walker: NodeWalker;

	const { dispatch, subscribe } = templateReducible();

	subscribe((value) => {
		parsedNode = value.node;
		markdownText = value.markdown;
		htmlText = value.html;
	});

	// onMount(() => {
	// 	console.log('running $');
	// 	// parsedNode = parser.parse(markdownText);
	// 	walker = parsedNode.walker();
	// 	htmlText = renderer.render(parsedNode);
	// 	// renderedMarkdownText = md2.render(markdownText);

	// 	if (markdownText.length > 0 && parsedNode) {
	// 		let event: NodeWalkingStep | null = null;
	// 		parsedNodes = [];

	// 		while ((event = walker.next())) {
	// 			if (event.node.literal !== null && event.node.literal !== undefined) {
	// 				if (event.node.parent !== null && !event.node.isContainer) {
	// 					// TODO: Handle lists?
	// 					const newItem: NodeRowItem = {
	// 						type: 'markdown',
	// 						value: renderer.render(event.node.parent)
	// 					};
	// 					parsedNodes = [...parsedNodes, newItem];
	// 				} else {
	// 					const newItem: NodeRowItem = {
	// 						type: 'markdown',
	// 						value: renderer.render(event.node)
	// 					};
	// 					parsedNodes = [...parsedNodes, newItem];
	// 				}
	// 			}
	// 		}
	// 	}
	// });

	// $: {
	// }

	function insertRow(location: number) {
		const newRow: NewRowItem = {
			type: 'new',
			value: ''
		};
		const newRows = [...parsedNodes];
		newRows.splice(location, 0, newRow);

		console.log('insertRow', newRows.length);
		parsedNodes = newRows;
		console.log('insertRow', parsedNodes.length);
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<ul class="list">
		{#each parsedNodes as node, i}
			<li>
				{#if node.type === 'boolean'}
					<!-- TODO: Allow editing of items -->
					{@html node.value}
					<InsertButtons index={i} clickAction={insertRow} totalLength={parsedNodes.length} />
				{:else if node.type === 'string'}
					<!-- TODO: Allow editing of items -->
					{@html node.value}
					<InsertButtons index={i} clickAction={insertRow} totalLength={parsedNodes.length} />
				{:else if node.type === 'new'}
					<!-- TODO: Allow editing of items -->
					{@html node.value}
					<CustomNode />
					<!-- <InsertButtons index={i} clickAction={insertRow} totalLength={parsedNodes.length} /> -->
				{:else}
					<!-- TODO: Allow editing of items -->
					{@html node.value}
					<InsertButtons index={i} clickAction={insertRow} totalLength={parsedNodes.length} />
				{/if}
			</li>
		{/each}
	</ul>
	<br />
	{@html htmlText}
</div>
