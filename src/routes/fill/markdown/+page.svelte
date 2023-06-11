<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';
	import { templateReducible } from '../../htmlTemplate.store';
	import type { FormEventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';

	let markdownText = '';
	let htmlText = '';

	const { dispatch, subscribe } = templateReducible();

	const handleMarkdownChange: FormEventHandler<HTMLTextAreaElement> = (e) => {
		dispatch({
			type: 'markdown',
			value: e.currentTarget.value
		});
	};

	subscribe((value) => {
		markdownText = value.markdown;
		htmlText = value.html;
	});

	function routeToCustomize() {
		goto('/customize');
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1>Create your template</h1>
	<form>
		<textarea class="textarea" on:input={handleMarkdownChange}>{markdownText}</textarea>

		<button use:clipboard={markdownText} class="btn variant-ringed-success">
			Copy form to clipboard
		</button>

		<button on:click|preventDefault={routeToCustomize} class="btn variant-ringed">
			Customize template
		</button>
	</form>

	<h3>MD Preview</h3>
	<pre>{@html htmlText}</pre>
</div>
