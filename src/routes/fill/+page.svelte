<script lang="ts">
	import { goto } from '$app/navigation';
	import { clipboard } from '@skeletonlabs/skeleton';
	import { templateReducible } from '../htmlTemplate.store';
	// import TurndownService from 'turndown';

	// var md = new TurndownService({
	// 	headingStyle: 'atx'
	// });
	// const reader = new Parser();
	// const writer = new HtmlRenderer();

	// $: parsedMarkdownText = md.turndown(htmlForm);
	// $: parsedMarkdownText = JSON.stringify(md.turndown(htmlForm));

	let htmlForm: string;

	const { dispatch, subscribe } = templateReducible();

	subscribe((val) => {
		htmlForm = val.html;
	});

	function routeToEdit() {
		// TODO: Different store...
		// htmlTemplate.set(renderer.render(parsedMarkdownText));
		// goto('/fill');
	}
</script>

<section class="container mx-auto p-8 space-y-8">
	<h1>Fill your template</h1>

	<form>
		{@html htmlForm}

		<!-- TODO: use proper values... -->
		<!-- <button use:clipboard={parsedMarkdownText} class="btn variant-ringed">
			Copy form to clipboard
		</button> -->

		<button on:click|preventDefault={routeToEdit} class="btn variant-ringed">
			Edit template
		</button>
	</form>
</section>
