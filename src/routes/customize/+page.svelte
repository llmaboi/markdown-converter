<script lang="ts">
	import type { Node, NodeWalkingStep } from 'commonmark';
	import { HtmlRenderer, Parser } from 'commonmark';
	import { onMount } from 'svelte';
	import { templateReducible } from '../htmlTemplate.store';
	import CustomNode from './CustomNode.svelte';
	import InsertButtons from './InsertButtons.svelte';
	import type {
		BooleanRowItem,
		JoinedRowItem,
		NewRowItem,
		NodeRowItem,
		RowType,
		StringRowItem
	} from '../rows.types';
	import { emptyCheck } from '../../components/emptyCheck';
	import { filledCheck } from '../../components/filledCheck';
	import TurndownService from 'turndown';
	import { empty } from 'svelte/internal';
	import MarkdownIt from 'markdown-it';

	const turndownSrvs = new TurndownService({ headingStyle: 'atx' });
	const parser = new Parser();
	const renderer = new HtmlRenderer();

	let parsedNode: Node;
	let parsedNodes: Readonly<JoinedRowItem[]>;
	// $: parsedNodes = [];
	let markdownText = '';
	let htmlText = '';
	// let walker: NodeWalker;

	const { dispatch, subscribe } = templateReducible();

	subscribe((value) => {
		parsedNode = value.node;
		markdownText = value.markdown;
		htmlText = value.html;
		parsedNodes = value.rows;
	});

	// onMount(() => {
	// 	updateNodes(parsedNode);
	// });

	// $: {
	// 	if (markdownText) {
	// 		const n = parser.parse(markdownText);
	// 		updateNodes(n);
	// 	}
	// }

	function insertRow(location: number) {
		const newRow: NewRowItem = {
			type: 'new',
			value: ''
		};
		const newRows = [...parsedNodes];
		newRows.splice(location, 0, newRow);

		parsedNodes = [...newRows];
	}

	// TODO: Move this logic into htmlTemplate.store
	function addRow(location: number, item: BooleanRowItem | StringRowItem) {
		const newRows = [...parsedNodes];

		switch (item.type) {
			case 'string':
				break;

			case 'boolean':
				const { value, text } = item;
				// if (typeof value === 'string') return;
				const newItem: BooleanRowItem = {
					type: 'boolean',
					text: text,
					value: value
				};

				newRows.splice(location, 1, newItem);
				break;

			default:
				break;
		}

		let sb = '';

		newRows.forEach((row) => {
			console.log(row.value);
			const val = String(row.value).replace('\n', '');

			if (row.type === 'boolean') {
				sb += `<p>${row.text} `;

				if (row.value === true) {
					sb += filledCheck;
				} else {
					sb += emptyCheck;
				}
				sb += '</p>\n';
			} else {
				sb += `${val}\n`;
			}
		});

		dispatch({
			type: 'html',
			value: sb
		});
	}

	// TODO: Move to other compnoent
	// function updateBooleanNode(location: number) {
	// 	const newRows = [...parsedNodes];

	// 	const foundRow = newRows.find((_row, i) => i === location);

	// 	if (typeof foundRow !== 'undefined' && foundRow.type === 'boolean') {
	// 		newRows.splice(location, 1, {
	// 			...foundRow,
	// 			value: !foundRow.value
	// 		});
	// 	}

	// 	parsedNodes = [...newRows];
	// }
</script>

<div class="container mx-auto p-8 space-y-8">
	<ul class="list">
		{#each parsedNodes as node, i}
			<li>
				{#if node.type === 'boolean'}
					<!-- TODO: Allow editing of items -- in separate component -->

					<!-- <button class="btn" on:click={() => updateBooleanNode(i)}> -->
					{@html node.text}
					{#if node.value}
						{filledCheck}
					{:else}
						{emptyCheck}
					{/if}
					<!-- </button> -->
					<InsertButtons index={i} clickAction={insertRow} totalLength={parsedNodes.length} />
				{:else if node.type === 'string'}
					<!-- TODO: Allow editing of items -->
					{@html node.value}
					<InsertButtons index={i} clickAction={insertRow} totalLength={parsedNodes.length} />
				{:else if node.type === 'new'}
					<!-- TODO: Allow editing of items -->
					{@html node.value}
					<CustomNode location={i} {addRow} />
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
