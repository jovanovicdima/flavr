<script lang="ts">
	import { enhance } from '$app/forms';
	import type { NewTicket } from '$lib/models/Ticket';
	import dayjs from 'dayjs';

	let title = $state('');
	let description = $state('');
	let location = $state('');
	let date = $state('');
	let time = $state('');
	let tickets: NewTicket[] = $state([]);
	let image: File | null = $state(null);

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
			title === '' ||
			description === '' ||
			location === '' ||
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
</script>

<form
	method="POST"
	use:enhance={() => {
		// Reset reactive state after successful submission
		title = '';
		description = '';
		location = '';
		date = '';
		time = '';
		tickets = [];
		image = null;
	}}
	class="mx-auto max-w-xl space-y-4 rounded-xl p-6 shadow-md"
	enctype="multipart/form-data"
>
	<h1 class="text-center text-2xl font-bold">Create Event</h1>

	<input
		type="text"
		name="title"
		bind:value={title}
		placeholder="Event Title"
		class="bg-background w-full rounded border p-2 placeholder-gray-400"
		required
	/>

	<textarea
		name="description"
		bind:value={description}
		placeholder="Description"
		rows="4"
		class="bg-background w-full rounded border p-2 placeholder-gray-400"
		required
	></textarea>

	<input
		type="text"
		name="location"
		bind:value={location}
		placeholder="Location"
		class="bg-background w-full rounded border p-2 placeholder-gray-400"
		required
	/>

	<div class="flex space-x-2">
		<input
			type="date"
			name="date"
			bind:value={date}
			min={dayjs().format('YYYY-MM-DD')}
			class="bg-background rounded border p-2 placeholder-gray-400"
			required
		/>

		<input
			type="time"
			name="time"
			bind:value={time}
			class="bg-background rounded border p-2 placeholder-gray-400"
			required
		/>
		<label
			class="bg-primary-500 hover:bg-primary-600 text-background flex flex-1 cursor-pointer items-center justify-center gap-2 truncate rounded p-2"
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
	</div>

	<input type="hidden" name="ticketsJson" value={JSON.stringify(tickets)} />

	<div class="pt-4">
		<h2 class="mb-2 text-center text-2xl font-semibold">Tickets</h2>
		{#each tickets as ticket, i}
			<div class="flex space-x-2">
				<input
					type="text"
					bind:value={ticket.name}
					placeholder="Ticket Name"
					class="bg-background flex-1 rounded border p-2 placeholder-gray-400"
				/>
				<input
					type="number"
					inputmode="numeric"
					bind:value={ticket.count}
					placeholder="Count"
					class="bg-background w-24 rounded border p-2 placeholder-gray-400"
				/>
				<input
					type="number"
					inputmode="numeric"
					bind:value={ticket.price}
					placeholder="Price"
					class="bg-background w-24 rounded border p-2 placeholder-gray-400"
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
			class="text-primary-500 hover:text-primary-600 mt-2 cursor-pointer">+ Add Ticket</button
		>
	</div>

	<button
		type="submit"
		class="{isError
			? 'bg-primary-800 cursor-not-allowed'
			: 'bg-primary-500 hover:bg-primary-600 cursor-pointer'} text-background w-full flex-1 rounded py-2"
		disabled={isError}
	>
		Create Event
	</button>
</form>
