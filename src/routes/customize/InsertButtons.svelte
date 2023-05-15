<script lang="ts">
	import UpArrow from '../../components/UpArrow.svelte';
	import DownArrow from '../../components/DownArrow.svelte';

	export let index: number;
	export let totalLength: number;
	export let clickAction: (num: number) => void;
</script>

{#if index === 0}
	<button class="btn badge-icon variant-filled" on:click={() => clickAction(index + 1)}>
		<DownArrow />
	</button>
{:else if index + 1 === totalLength}
	<button class="btn badge-icon variant-filled" on:click={() => clickAction(index)}>
		<UpArrow />
	</button>
{:else}
	<button class="btn badge-icon variant-filled" on:click={() => clickAction(index)}>
		<UpArrow />
	</button>
	<button class="btn badge-icon variant-filled" on:click={() => clickAction(index + 1)}>
		<DownArrow />
	</button>
{/if}
