import { writable } from 'svelte/store';
import { Parser, HtmlRenderer, Node } from 'commonmark';
import TurndownService from 'turndown';

const TemplateTypes = {
	html: 'html',
	node: 'node',
	markdown: 'markdown'
} as const;

type TemplateStoreCore = {
	[TemplateTypes.html]: Readonly<string>;
	[TemplateTypes.node]: Readonly<Node>;
	[TemplateTypes.markdown]: Readonly<string>;
};

const turndownSrvs = new TurndownService({ headingStyle: 'atx' });
const parser = new Parser();
const renderer = new HtmlRenderer();

type markdownAction = { value: string; type: typeof TemplateTypes.markdown };
type nodeAction = { value: Node; type: typeof TemplateTypes.node };
type htmlAction = { value: string; type: typeof TemplateTypes.html };

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

	return {
		node: node,
		html: renderer.render(node),
		markdown: value
	};
}

function fromHtml(value: string): TemplateStoreCore {
	const mdValue = turndownSrvs.turndown(value);
	const node = parser.parse(value);

	return {
		node: node,
		html: value,
		markdown: mdValue
	};
}

function fromNode(value: Node): TemplateStoreCore {
	return {
		node: value,
		html: renderer.render(value),
		markdown: '' // TODO: value
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
