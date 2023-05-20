import { writable } from 'svelte/store';
import { Parser, HtmlRenderer, Node, type NodeWalkingStep } from 'commonmark';
import TurndownService from 'turndown';
import type { NodeRowItem } from './rows.types';

// TODO: Maintain the "NODES" here and update them as need-be.
//  We will need to reference what type of "node" it is for the
//    "fill" part of the form.

const TemplateTypes = {
	html: 'html',
	node: 'node',
	markdown: 'markdown',
	rows: 'rows'
} as const;

type TemplateStoreCore = {
	[TemplateTypes.html]: Readonly<string>;
	[TemplateTypes.node]: Readonly<Node>;
	[TemplateTypes.markdown]: Readonly<string>;
	[TemplateTypes.rows]: Readonly<NodeRowItem[]>;
};

const turndownSrvs = new TurndownService({ headingStyle: 'atx' });
const parser = new Parser();
const renderer = new HtmlRenderer({ softbreak: '<br />' });

type markdownAction = { value: string; type: typeof TemplateTypes.markdown };
type nodeAction = { value: Node; type: typeof TemplateTypes.node };
type htmlAction = { value: string; type: typeof TemplateTypes.html };
// Value HTML string, type: 'html', location where to replace this item.
type rowsAction = { value: string; type: typeof TemplateTypes.html; location: number };

//
//
function getNodes(markdownText: string) {
	const nodes = parser.parse(markdownText);
	const walker = nodes.walker();
	let event: NodeWalkingStep | null = null;
	const newNodes: NodeRowItem[] = [];

	while ((event = walker.next())) {
		if (event.node.literal !== null && event.node.literal !== undefined) {
			if (event.entering && event.node.type === 'text') {
				// node.literal = node.literal.toUpperCase();
				// console.log(event.node.literal);
			}

			if (event.node.parent !== null && !event.node.isContainer) {
				// TODO: Handle lists?
				const newItem: NodeRowItem = {
					type: 'html',
					value: renderer.render(event.node.parent)
				};
				newNodes.push(newItem);
				// parsedNodes = [...parsedNodes, newItem];
			} else {
				const newItem: NodeRowItem = {
					type: 'html',
					value: renderer.render(event.node)
				};
				newNodes.push(newItem);
				// parsedNodes = [...parsedNodes, newItem];
			}
		}
	}

	console.log(newNodes);

	return newNodes;
}
//
//

function templateReducer(action: htmlAction | nodeAction | markdownAction): TemplateStoreCore {
	switch (action.type) {
		case 'html':
			console.log(action.value);
			return fromHtml(action.value);
		case 'node':
			console.log(action.value);
			return fromNode(action.value);
		case 'markdown':
			console.log(action.value);
			return fromMarkdown(action.value);
		default:
			throw assertUnreachable(action);
	}
}

function fromMarkdown(value: string): TemplateStoreCore {
	const node = parser.parse(value);
	const html = renderer.render(node);
	return {
		node: node,
		html,
		markdown: value,
		rows: getNodes(value)
	};
}

function fromHtml(value: string): TemplateStoreCore {
	const mdValue = turndownSrvs.turndown(value);
	const node = parser.parse(value);

	return {
		node: node,
		html: value,
		markdown: mdValue,
		rows: getNodes(mdValue)
	};
}

function fromNode(value: Node): TemplateStoreCore {
	return {
		node: value,
		html: renderer.render(value),
		markdown: '', // TODO: value
		rows: getNodes('') // TODO: value
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

	function dispatch(action: htmlAction | nodeAction | markdownAction) {
		update(() => templateReducer(action));
	}

	return { subscribe, dispatch };
}

// //
// function reducer(count: number, action: { type: string }) {
// 	switch (action.type) {
// 		case 'increment':
// 			return count + 1;
// 		case 'decrement':
// 			return count - 1;
// 		default:
// 			throw new Error();
// 	}
// }

// const [count, dispatch] = reducible(0, reducer);

// export function reducible(
// 	state: number,
// 	reducer: (count: number, action: { type: string }) => number
// ) {
// 	const { update, subscribe } = writable(state);

// 	function dispatch(action: { type: string }) {
// 		update((state) => templateReducer(state, action));
// 	}

// 	return [{ subscribe }, dispatch];
// }
