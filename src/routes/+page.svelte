<script lang="ts">
	import { Parser, HtmlRenderer } from 'commonmark';

	const reader = new Parser();
	const writer = new HtmlRenderer();

	let markdownText = '';
	let parsedMarkdownText = reader.parse(markdownText);
	let renderedMarkdownText = '';
	let walker;
	let event;
	let node;

	$: {
		parsedMarkdownText = reader.parse(markdownText);
		walker = parsedMarkdownText.walker();
		renderedMarkdownText = writer.render(parsedMarkdownText);

		if (markdownText.length > 0 && parsedMarkdownText) {
			while ((event = walker.next())) {
				node = event.node;
				if (node.literal !== null && node.literal !== undefined) {
					console.log('node: ', node.literal);
				}
			}
		}
	}

	function downloadData() {
		// If the data is string, you can convert it to Blob using: new Blob([stringData]).
		var a = document.createElement('a');

		document.body.append(a);

		a.download = 'template.html';

		a.href = URL.createObjectURL(new Blob([renderedMarkdownText]));

		a.click();

		a.remove();
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
	<h1>Would you like to create a new template or fill one out?</h1>

	<a href="/create" class="btn variant-ringed" data-sveltekit-preload-data="hover">Create</a>

	<a href="/fill" class="btn variant-ringed" data-sveltekit-preload-data="hover">Fill</a>
</div>
