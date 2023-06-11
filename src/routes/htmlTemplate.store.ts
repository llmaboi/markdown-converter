import { HtmlRenderer, Node, Parser, type NodeWalkingStep } from 'commonmark';
import { writable } from 'svelte/store';
import TurndownService from 'turndown';
import { emptyCheck } from '../components/emptyCheck';
import { filledCheck } from '../components/filledCheck';
import type { JoinedRowItemNotNew, NodeRowItem } from './rows.types';

// TODO: Maintain the "NODES" here and update them as need-be.
//  We will need to reference what type of "node" it is for the
//    "fill" part of the form.

const TemplateTypes = {
	html: 'html',
	node: 'node',
	markdown: 'markdown',
	rows: 'rows',
	row: 'row',
	remove: 'remove',
} as const;

type TemplateStoreCore = {
	[TemplateTypes.html]: Readonly<string>;
	[TemplateTypes.node]: Readonly<Node>;
	[TemplateTypes.markdown]: Readonly<string>;
	[TemplateTypes.rows]: Readonly<JoinedRowItemNotNew[]>;
};

/**
 * Parsers
 */
const turndownSrvs = new TurndownService({ headingStyle: 'atx' });
const parser = new Parser();
const renderer = new HtmlRenderer();

/**
 * Actions on store.
 */
type markdownAction = { value: string; type: typeof TemplateTypes.markdown };
type nodeAction = { value: Node; type: typeof TemplateTypes.node };
type htmlAction = { value: string; type: typeof TemplateTypes.html };

// Value HTML string, type: 'html', location where to replace this item.
type rowCreateAction = {
	value: JoinedRowItemNotNew;
	type: typeof TemplateTypes.row;
	location: number;
};
type rowUpdateAction = {
	value: JoinedRowItemNotNew;
	type: typeof TemplateTypes.rows;
	location: number;
};
type rowRemoveAction = {
	type: typeof TemplateTypes.remove;
	location: number;
};

// Internal store of each row item added.
let rowItems: JoinedRowItemNotNew[] = [];

function getNodes(markdownText: string) {
	const nodes = parser.parse(markdownText);
	const walker = nodes.walker();
	let event: NodeWalkingStep | null = null;
	const newNodes: NodeRowItem[] = [];

	while ((event = walker.next())) {
		if (event.node.literal !== null && event.node.literal !== undefined) {
			// if (event.entering && event.node.type === 'text') {
			// node.literal = node.literal.toUpperCase();
			// console.log(event.node.literal);
			// }

			if (event.node.parent !== null && !event.node.isContainer) {
				// TODO: Handle lists?
				const newItem: NodeRowItem = {
					type: 'html',
					value: renderer.render(event.node.parent)
				};
				newNodes.push(newItem);
			} else {
				const newItem: NodeRowItem = {
					type: 'html',
					value: renderer.render(event.node)
				};
				newNodes.push(newItem);
			}
		}
	}

	console.log(newNodes);

	return newNodes;
}

function templateReducer(
	action: htmlAction | nodeAction | markdownAction | rowCreateAction | rowUpdateAction | rowRemoveAction
): TemplateStoreCore {
	switch (action.type) {
		case 'html':
			return fromHtml(action.value);
		case 'node':
			return fromNode(action.value);
		case 'markdown':
			return fromMarkdown(action.value);
		case 'rows':
			return fromRowItem(action.value, action.location);
		case 'row':
			return updateRowItem(action.value, action.location);
			case 'remove':
				return removeRowItem( action.location);
		default:
			throw assertUnreachable(action);
	}
}

function updateRowItem(value: JoinedRowItemNotNew, location: number): TemplateStoreCore {
	let convertedValue = '';

	if (value.type === 'boolean') {
		convertedValue += value.text;

		if (value.value === true) {
			convertedValue = convertedValue.replace(emptyCheck, filledCheck);
		} else {
			convertedValue = convertedValue.replace(filledCheck, emptyCheck);
		}

		const node = parser.parse(convertedValue);
		const html = renderer.render(node);
		rowItems.splice(location, 1, {
			type: 'boolean',
			text: html,
			value: value.value
		});
	} else if(value.type === 'string') {
		convertedValue += `${value.value}`;

		const node = parser.parse(convertedValue);
		const html = renderer.render(node);

		rowItems.splice(location, 1, {
			type: 'string',
			value: html,
			// replacer: value.replacer
		});
	}

	const joinedNodes = rowItems
		.map((item) => {
			if (item.type === 'string' || item.type === 'html') return item.value;
			if (item.type === 'boolean') return item.text;
		})
		.join('\n');
	const newFullNode = parser.parse(joinedNodes);
	const newFullHtml = renderer.render(newFullNode);
	const mdValue = turndownSrvs.turndown(newFullHtml);

	return {
		node: newFullNode,
		html: newFullHtml,
		markdown: mdValue,
		rows: rowItems
	};
}

function removeRowItem(location: number) {
	rowItems.splice(location, 1);
	
	const joinedNodes = rowItems
		.map((item) => {
			if (item.type === 'string' || item.type === 'html') return item.value;
			if (item.type === 'boolean') return item.text;
		})
		.join('\n');
	const newFullNode = parser.parse(joinedNodes);
	const newFullHtml = renderer.render(newFullNode);
	const mdValue = turndownSrvs.turndown(newFullHtml);

	return {
		node: newFullNode,
		html: newFullHtml,
		markdown: mdValue,
		rows: rowItems
	};
}

function fromRowItem(value: JoinedRowItemNotNew, location: number): TemplateStoreCore {
	let convertedValue = '';

	if (value.type === 'boolean') {
		convertedValue += `<p>${value.text} `;

		if (value.value === true) {
			convertedValue += filledCheck;
		} else {
			convertedValue += emptyCheck;
		}
		convertedValue += '</p>';

		const node = parser.parse(convertedValue);
		const html = renderer.render(node);
		rowItems.splice(location, 0, {
			type: 'boolean',
			text: html,
			value: value.value
		});
	} else if(value.type ==='string') {
		// TODO: This needs to factor in the "replacer" still.
		convertedValue += `${value.value}`;

		const node = parser.parse(convertedValue);
		const html = renderer.render(node);

		rowItems.splice(location, 0, {
			type: 'string',
			value: html,
			// replacer: value.replacer
		});
	}

	const joinedNodes = rowItems
		.map((item) => {
			if (item.type === 'string' || item.type === 'html') return item.value;
			if (item.type === 'boolean') return item.text;
		})
		.join('\n');
	const newFullNode = parser.parse(joinedNodes);
	const newFullHtml = renderer.render(newFullNode);
	const mdValue = turndownSrvs.turndown(newFullHtml);

	return {
		node: newFullNode,
		html: newFullHtml,
		markdown: mdValue,
		rows: rowItems
	};
}

function fromMarkdown(value: string): TemplateStoreCore {
	const node = parser.parse(value);
	const html = renderer.render(node);

	const nodes = getNodes(value);
	rowItems = nodes.map((item) => ({
		type: 'html',
		value: item.value
	}));
	return {
		node: node,
		html,
		markdown: value,
		rows: rowItems
	};
}

function fromHtml(value: string): TemplateStoreCore {
	const mdValue = turndownSrvs.turndown(value);
	const node = parser.parse(value);

	const nodes = getNodes(mdValue);
	rowItems = nodes.map((item) => ({
		type: 'html',
		value: item.value
	}));

	return {
		node: node,
		html: value,
		markdown: mdValue,
		rows: rowItems
	};
}

// TODO: I'm not sure?
function fromNode(value: Node): TemplateStoreCore {
	// const nodes = getNodes(value);
	// htmlNodes = nodes.map((item) => item.value);

	return {
		node: value,
		html: renderer.render(value),
		markdown: '', // TODO: value
		rows: [] // getNodes('') // TODO: value
	};
}

function assertUnreachable(_x: never): never {
	throw new Error("Didn't expect to get here");
}

const { subscribe, update, set } = writable<TemplateStoreCore>();
let first = 0;

/**
 * If you need state made pass null as
 *  the initial value.
 */
export function templateReducible() {
	if (first === 0)
		set(
			templateReducer({
				type: 'markdown',
				value: ''
			})
		);

	first++;

	function dispatch(
		action: htmlAction | nodeAction | markdownAction | rowCreateAction | rowUpdateAction | rowRemoveAction
	) {
		update(() => templateReducer(action));
	}

	return { subscribe, dispatch };
}
