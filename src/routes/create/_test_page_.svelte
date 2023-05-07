<script lang="ts">
	import { goto } from '$app/navigation';
	import { Accordion, AccordionItem, CodeBlock } from '@skeletonlabs/skeleton';
	import MarkdownIt from 'markdown-it';
	import { htmlTemplate } from '../htmlTemplate.store';
	import { Parser, HtmlRenderer, Node } from 'commonmark';

	const parser = new Parser();
	const renderer = new HtmlRenderer();

	const md = new MarkdownIt({
		html: true
	});
	const md2 = new MarkdownIt({
		// html: true
	});

	let markdownText = '';
	let parsedNode: Node;
	// let parsedMarkdownText = md.render(markdownText);
	let htmlText = '';
	// let walker;
	// let event;
	// let node;

	// TODO:
	// htmlTemplate.subscribe((value) => {
	// 	htmlForm = value;
	// });

	$: {
		// parsedMarkdownText = md.render(markdownText);
		parsedNode = parser.parse(markdownText);
		// walker = parsedMarkdownText.walker();
		htmlText = renderer.render(parsedNode);
		// renderedMarkdownText = md2.render(markdownText);

		// if (markdownText.length > 0 && parsedMarkdownText) {
		// 	while ((event = walker.next())) {
		// 		node = event.node;
		// 		if (node.literal !== null && node.literal !== undefined) {
		// 			console.log('node: ', node.literal);
		// 		}
		// 	}
		// }
	}

	function downloadData() {
		// If the data is string, you can convert it to Blob using: new Blob([stringData]).
		var a = document.createElement('a');

		document.body.append(a);

		a.download = 'template.html';

		a.href = URL.createObjectURL(new Blob([htmlText]));

		a.click();

		a.remove();
	}

	function routeToFill() {
		htmlTemplate.set(htmlText);

		goto('/fill');
	}

	/**
	 * TODO:
	 * 1. Allow users to save a "template"
	 * 2. Allow users to download the "template"
	 * 3. Allow users to upload a "template"
	 * 4. Allow users to fill the "template"
	 * 5. Allow the users to copy the generated Markdown from the "template"
	 * 6. FINAL
	 *
	 * Next features is to replace `input` tags with `checkbox` with
	 *   allowed icons for ✅ OR ☑️.
	 *
	 * Future -- Add features for other input types
	 */
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1>Create your template</h1>
	<form>
		<textarea class="textarea" bind:value={markdownText} />

		<button on:click|preventDefault={downloadData} class="btn variant-ringed">
			Download template
		</button>

		<button on:click|preventDefault={routeToFill} class="btn variant-ringed">
			Fill made template
		</button>
	</form>

	<Accordion>
		<AccordionItem open>
			<svelte:fragment slot="summary">HTML Preview</svelte:fragment>

			<svelte:fragment slot="content">
				<CodeBlock language="html" code={htmlText} />

				<pre>{@html htmlText}</pre>
			</svelte:fragment>
		</AccordionItem>
		<AccordionItem open>
			<svelte:fragment slot="summary">MD Preview</svelte:fragment>

			<svelte:fragment slot="content">
				<CodeBlock language="md" code={markdownText} />

				<pre>{@html htmlText}</pre>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
</div>
