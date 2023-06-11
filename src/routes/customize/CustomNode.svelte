<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';
	import type { BooleanRowItem, RowType, StringRowItem } from '../rows.types';

	export let location: number;
	export let addRow: (
		location: number,
		// type: Extract<RowType, 'boolean' | 'string'>,
		item: BooleanRowItem | StringRowItem
	) => void;

	export let cancelAdd: (location: number) => void;

	let selectedValue: Extract<RowType, 'boolean' | 'string'>;

	// const parser = new Parser();
	// const renderer = new HtmlRenderer();

	type SelectOption = {
		value: RowType;
		label: string;
	};

	const selectOptions: SelectOption[] = [
		{
			value: 'boolean',
			label: 'Boolean'
		},
		{
			value: 'string',
			label: 'String'
		}
	];

	const addItem: FormEventHandler<HTMLFormElement> = (e) => {
		// TODO: Handle this with superforms eventually
		// @ts-ignore
		const formData = new FormData(e.target);
		const type = formData.get('type');

		if (type === 'boolean') {
			const booleanText = formData.get('boolean-text')?.toString();
			if (booleanText === undefined || (typeof booleanText === 'string' && booleanText === ''))
				return;
			addRow(location, {
				text: booleanText,
				type: 'boolean',
				value: false
			});
		} else if (type === 'string') {
			const stringValue = formData.get('string-value')?.toString();
			// const stringReplace = formData.get('string-replace')?.toString();
			console.log('stringValue', stringValue);
			// console.log('stringReplace', stringReplace);
			// TODO: Warn that you cannot submit this?
			if (
				stringValue === undefined
				// || stringReplace === undefined
			)
				return;

			addRow(location, {
				value: stringValue,
				type: 'string'
				// replacer: stringReplace
			});
		}
	};
</script>

<form on:submit|preventDefault={addItem}>
	<label class="label" for="type">
		<span>Select custom type:</span>
		<select name="type" class="select" bind:value={selectedValue}>
			{#each selectOptions as { value, label }}
				<option {value}>{label}</option>
			{/each}
		</select>
	</label>

	{#if selectedValue === 'boolean'}
		<!-- LABEL -->
		<label class="label" for="boolean-text">
			<span>Boolean Name:</span>
			<input name="boolean-text" type="text" class="input" />
		</label>
	{:else if selectedValue === 'string'}
		<!-- LABEL -->
		<!-- <label class="label">
			<span>String Name:</span>
			<input name="stringName" type="text" class="input" />
		</label> -->
		<label class="label">
			<span>String value:</span>
			<input name="string-value" type="text" class="input" />
		</label>
		<!-- <label class="label">
			<span>String replace characters:</span>
			<input name="string-replace" type="text" class="input" />
		</label> -->
	{/if}

	<button on:click|preventDefault={() => cancelAdd(location)} class="btn variant-ringed-warning">
		Cancel
	</button>

	<button type="submit" class="btn variant-ringed-success">Add</button>
</form>
