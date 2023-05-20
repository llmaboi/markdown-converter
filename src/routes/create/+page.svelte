<script lang="ts">
	import { goto } from '$app/navigation';
	import { Accordion, AccordionItem, CodeBlock } from '@skeletonlabs/skeleton';
	// import MarkdownIt from 'markdown-it';
	import type { Node } from 'commonmark';
	import type { FormEventHandler } from 'svelte/elements';
	import { templateReducible } from '../htmlTemplate.store';

	let markdownText = '';
	let parsedNode: Node;
	let htmlText = '';

	const { dispatch, subscribe } = templateReducible();

	subscribe((value) => {
		parsedNode = value.node;
		htmlText = value.html;
		markdownText = value.markdown;
	});

	function downloadData() {
		// If the data is string, you can convert it to Blob using: new Blob([stringData]).
		var a = document.createElement('a');

		document.body.append(a);

		a.download = 'template.html';

		a.href = URL.createObjectURL(new Blob([htmlText]));

		a.click();

		a.remove();
	}

	const handleMarkdownChange: FormEventHandler<HTMLTextAreaElement> = (e) => {
		dispatch({
			type: 'markdown',
			value: e.currentTarget.value
		});
	};

	function routeToCustomize() {
		// Add raw MD or parsed nodes to store
		//  so it can be re-used in the customized page.
		// dispatch({
		// 	type: 'html',
		// 	value: htmlText
		// });

		goto('/customize');
	}

	function routeToFill() {
		// htmlTemplate.set(htmlText);
		dispatch({
			type: 'html',
			value: htmlText
		});

		goto('/fill');
	}

	/**
	 * TODO:
	 * 1. Allow users to save a "template"
	 *   a. Allow input of MD, on submit see if it is all valid,
	 *      if it is not, return back to the input and split each
	 *      section into its own input.
	 *     i. If a line is valid mark it as such.
	 *     ii. if a line is not valid, show the error and try to explain a fix.
	 *   a. If a user wants to add interactivity to this "template"
	 *      add a "customize" button which will split each section to its own input.
	 *     i. Adding a "custom" will require a type, boolean or string as an input
	 *        then generate a template with the string param replace or render a checkmark.
	 *
	 * 2. Allow users to download the "template"
	 * 3. Allow users to upload a "template"
	 * 4. Allow users to fill the "template"
	 *   a. Users templates with "custom" values must be filled before they can
	 *      download the result.
	 *     i. Checkboxes become icons / valid emojis.
	 *     ii. Custom strings replace the proper values in the string template.
	 * 5. Allow the users to copy or download the generated Markdown from the "template"
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
		<textarea class="textarea" on:input={handleMarkdownChange} />

		<button on:click|preventDefault={downloadData} class="btn variant-ringed">
			Download template
		</button>

		<!-- <button on:click|preventDefault={routeToFill} class="btn variant-ringed">
			Fill made template
		</button> -->

		<button on:click|preventDefault={routeToCustomize} class="btn variant-ringed">
			Customize template
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
