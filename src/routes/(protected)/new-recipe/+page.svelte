<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';

	let name = $state('');
	let description = $state('');
	let preparationTimeInMinutes = $state<number | null>(null);
	let difficulty = $state('');
	let date = $state('');
	let time = $state('');
	let tickets: NewTicket[] = $state([]);
	let steps: string[] = $state([]);
	let image: File | null = $state(null);
	let notes = $state('');

	$effect(() => {
		if (date && time) {
			const now = dayjs();
			const selectedDatetime = dayjs(`${date} ${time}`);

			if (selectedDatetime.isBefore(now)) {
				date = now.format('YYYY-MM-DD');
				time = now.format('HH:mm');
			}
		}
	});

	let isError = $derived.by(() => {
		if (
			name === '' ||
			description === '' ||
			(preparationTimeInMinutes !== null && preparationTimeInMinutes <= 0) ||
			date === '' ||
			time === '' ||
			tickets.length < 1
		) {
			return true;
		}

		for (const ticket of tickets) {
			if (ticket.name === '' || ticket.price === 0 || ticket.count === 0) {
				return true;
			}
		}

		return false;
	});

	function addTicket() {
		tickets.push({ name: '', count: 0, price: 0 });
	}

	function removeTicket(index: number) {
		tickets.splice(index, 1);
	}

	function addStep() {
		steps.push('');
	}

	function removeStep(index: number) {
		steps.splice(index, 1);
	}
</script>

<form
	method="POST"
	use:enhance={() => {
		// Reset reactive state after successful submission
		name = '';
		description = '';
		preparationTimeInMinutes = null;
		date = '';
		time = '';
		tickets = [];
		image = null;
	}}
	class="mx-auto max-w-xl space-y-16 rounded-xl p-6 shadow-md"
	enctype="multipart/form-data"
>
	<div class="space-y-4">
		<h1 class="text-center text-2xl font-bold">Create Recipe</h1>
		<input
			type="text"
			name="title"
			bind:value={name}
			placeholder="Recipe Name"
			class="w-full rounded border bg-background p-2 placeholder-gray-400"
			required
		/>

		<input
			type="number"
			name="preparationTimeInMinutes"
			bind:value={preparationTimeInMinutes}
			placeholder="⏲ Preparation time (minutes)"
			class="w-full rounded border bg-background p-2 placeholder-gray-400"
			required
		/>

		<!-- TODO: Dropdown -->
		<input
			type="text"
			name="difficulty"
			bind:value={difficulty}
			placeholder="Difficulty"
			class="w-full rounded border bg-background p-2 placeholder-gray-400"
			required
		/>
	</div>

	<input type="hidden" name="ticketsJson" value={JSON.stringify(tickets)} />

	<div>
		<h2 class="mb-2 text-center text-2xl font-semibold">Ingredients</h2>
		{#each tickets as ticket, i}
			<div class="flex space-x-2">
				<input
					type="text"
					bind:value={ticket.name}
					placeholder="Ticket Name"
					class="flex-1 rounded border bg-background p-2 placeholder-gray-400"
				/>
				<input
					type="number"
					inputmode="numeric"
					bind:value={ticket.count}
					placeholder="Count"
					class="w-24 rounded border bg-background p-2 placeholder-gray-400"
				/>
				<input
					type="number"
					inputmode="numeric"
					bind:value={ticket.price}
					placeholder="Price"
					class="w-24 rounded border bg-background p-2 placeholder-gray-400"
				/>
				<button
					type="button"
					onclick={() => removeTicket(i)}
					class="cursor-pointer px-2 text-red-500">✕</button
				>
			</div>
		{/each}
		<button
			type="button"
			onclick={addTicket}
			class="mt-2 cursor-pointer text-primary-500 hover:text-primary-600">+ Add Ticket</button
		>
	</div>

	<div>
		<h2 class="mb-2 text-center text-2xl font-semibold">Steps</h2>
		<div class="space-y-1">
			{#each steps as _, i}
				<div class="flex items-center gap-2 space-x-2">
					{`Step ${i}:`}
					<!-- TODO: add multiline input -->
					<input
						type="text"
						bind:value={steps[i]}
						placeholder="Step Description"
						class="flex-1 rounded border bg-background p-2 placeholder-gray-400"
					/>

					<button
						type="button"
						onclick={() => removeStep(i)}
						class="cursor-pointer px-2 text-red-500">✕</button
					>
				</div>
			{/each}
		</div>
		<button
			type="button"
			onclick={addStep}
			class="mt-2 cursor-pointer text-primary-500 hover:text-primary-600">+ Add Step</button
		>
	</div>

	<div class="flex flex-col gap-4">
		<label
			class="flex flex-1 cursor-pointer items-center justify-center gap-2 truncate rounded bg-primary-500 p-2 text-background hover:bg-primary-600"
		>
			<input
				type="file"
				name="image"
				accept="image/*"
				class="hidden"
				onchange={(e) => {
					const target = e.target as HTMLInputElement;
					image = target.files?.[0] ?? null;
				}}
			/>
			<span class="max-w-full truncate text-center">
				{#if image}
					Selected: {image.name}
				{:else}
					Choose an image
				{/if}
			</span>
		</label>

		<textarea
			name="notes"
			bind:value={notes}
			placeholder="Notes"
			rows="4"
			class="w-full rounded border bg-background p-2 placeholder-gray-400"
			required
		></textarea>

		<button
			type="submit"
			class="{isError
				? 'cursor-not-allowed bg-primary-800'
				: 'cursor-pointer bg-primary-500 hover:bg-primary-600'} w-full flex-1 rounded py-2 text-background"
			disabled={isError}
		>
			Create Recipe
		</button>
	</div>
</form>
