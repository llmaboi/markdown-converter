<script lang="ts">
	import { Parser, HtmlRenderer } from 'commonmark';

	const reader = new Parser();
	const writer = new HtmlRenderer();

	let markdownText = '';

	$: parsedMarkdownText = reader.parse(markdownText);
	$: renderedMarkdownText = writer.render(parsedMarkdownText);
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1>Hello Skeleton</h1>
	<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
	<section>
		<textarea class="textarea" bind:value={markdownText} />
	</section>
	<pre>{parsedMarkdownText}</pre>
	<pre>{@html renderedMarkdownText}</pre>
</div>
