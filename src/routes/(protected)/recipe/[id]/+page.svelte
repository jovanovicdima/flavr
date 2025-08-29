<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import type { PageProps } from './$types';
	import { Flame, ThumbsDown, ThumbsUp } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	dayjs.extend(relativeTime);

	const { data }: PageProps = $props();

	let vote: boolean | null = $state(data.vote ?? null);
	let likes: number = $state(data.recipe!.likes);
	let dislikes: number = $state(data.recipe!.dislikes);

	let error: string | null = $state(null);
	let isLoading = $state(false);
	let isDeleting = $state(false);
	let showDeleteModal = $state(false);

	async function handleVote(newVote: boolean) {
		if (isLoading) return;

		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/vote', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					recipeId: data.recipe!._id,
					like: newVote
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (vote === newVote) {
				if (newVote !== null) {
					if (newVote) likes--;
					else dislikes--;
				}
			} else {
				if (vote === null) {
					if (newVote !== null) {
						if (newVote) likes++;
						else dislikes++;
					}
				} else {
					if (vote) {
						likes--;
						if (newVote === false) dislikes++;
					} else {
						dislikes--;
						if (newVote === true) likes++;
					}
				}
			}
			vote = vote === newVote ? null : newVote;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong';
			console.error('Vote failed:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="mx-2 flex flex-col gap-12 px-1 py-2 sm:py-4 lg:px-4">
	<div class="max-w-screen-xl gap-4 sm:grid sm:grid-cols-2 md:gap-8 xl:gap-16">
		{#if data.recipe!.image}
			<div class="h-96 w-full overflow-hidden rounded-md">
				<img
					aria-hidden="true"
					class="h-full w-full object-cover"
					src={`/eventImages/${data.recipe!.image}`}
					alt="event image preview"
				/>
			</div>
		{:else}
			<div class="h-96 w-full overflow-hidden rounded-md">
				<img
					aria-hidden="true"
					class="h-full w-full object-cover"
					src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
					alt="event image preview"
				/>
			</div>
		{/if}

		<div class="my-2 flex flex-col justify-between">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<h2 class="text-4xl font-extrabold tracking-tight text-text">
						{data.recipe!.name}
					</h2>
					<p class="ml-1 text-xs font-light text-gray-500">
						Posted by {data.recipe!.postedBy}
						{dayjs().to(dayjs(data.recipe!.postedAt))}
					</p>
					<p class="flex items-center gap-1 text-sm font-light text-gray-400">
						<svg
							class="h-4 w-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v6l4 2m4-2a8 8 0 11-16 0 8 8 0 0116 0z"
							/>
						</svg>

						{data.recipe!.preparationTimeInMinutes} minutes
					</p>
					<p class="flex items-center gap-1 text-sm font-light text-gray-400">
						<Flame size={16} />

						{data.recipe!.difficulty}
					</p>
				</div>

				<div>
					<h3 class="text-lg font-bold">Ingredients</h3>
					<ul class="ml-6 list-disc">
						{#each data.recipe!.ingredients as ingredient}
							<li>
								{ingredient.quantity}
								{ingredient.unit}
								{ingredient.ingredient}
							</li>
						{/each}
					</ul>
				</div>

				<div class="flex gap-4">
					<button
						class="flex cursor-pointer items-center gap-2"
						onclick={() => {
							handleVote(true);
						}}
					>
						<ThumbsUp size={16} color={vote ? 'var(--color-primary-500)' : 'var(--color-text)'} />
						{likes}
					</button>

					<button
						class="flex cursor-pointer items-center gap-2"
						onclick={() => {
							handleVote(false);
						}}
					>
						<ThumbsDown
							size={16}
							color={vote === false ? 'var(--color-primary-500)' : 'var(--color-text)'}
						/>
						{dislikes}
					</button>
				</div>
			</div>

			{#if data.recipe!.postedBy === data.userEmail}
				<div class="flex w-full items-end justify-around gap-4">
					<button
						type="button"
						class="flex w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-1 border-primary-500 py-2 text-primary-500 hover:text-primary-800"
						onclick={() => {
							goto(`/edit-event/${data.recipe!._id}`);
						}}>Edit</button
					>
					<button
						type="button"
						class="flex w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-1 border-red-500 py-2 text-red-500 hover:text-red-800"
						onclick={() => {
							showDeleteModal = true;
						}}>Delete</button
					>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-col gap-24 px-4 py-2 sm:py-4">
		<div>
			<h2 class="text-center text-2xl font-bold">Steps</h2>

			<ol class="ml-6 list-decimal">
				{#each data.recipe!.steps as step}
					<li>{step}</li>
				{/each}
			</ol>
		</div>

		{#if data.recipe!.notes && data.recipe!.notes.length > 0}
			<div>
				<h2 class="text-center text-2xl font-bold">Notes</h2>
				<p class="ml-6 text-sm">{data.recipe!.notes}</p>
			</div>
		{/if}
	</div>
</div>

{#if showDeleteModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-bold">Confirm Deletion</h2>
			<p class="mb-6 text-gray-400">
				Are you sure you want to delete this recipe? This action cannot be undone.
			</p>
			<div class="flex justify-end gap-4">
				<button
					class="cursor-pointer rounded bg-primary-500 px-4 py-2 text-black hover:bg-primary-600"
					onclick={() => {
						showDeleteModal = false;
					}}
				>
					Cancel
				</button>
				<form
					action="?/delete"
					method="POST"
					use:enhance={() => {
						isDeleting = true;

						return async ({ update }) => {
							await update();
							isDeleting = false;
							goto('/');
						};
					}}
				>
					<button
						class="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
						type="submit"
					>
						Delete
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
