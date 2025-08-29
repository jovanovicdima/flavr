<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Recipe } from '$lib/models/Recipe';
	import { Flame, ThumbsUp, ThumbsDown } from 'lucide-svelte';

	type RecipeCardProps = {
		recipe: Recipe;
	};

	let { recipe }: RecipeCardProps = $props();
</script>

<button
	class="w-full cursor-pointer rounded-lg border border-background2-600"
	onclick={() => {
		goto(`/recipe/${recipe._id}`, { invalidateAll: true });
	}}
>
	<div
		class="flex h-full flex-col items-start bg-background2-800 p-4 transition hover:bg-background2-700"
	>
		{#if recipe.image}
			<div class="h-48 w-full overflow-hidden rounded-md">
				<img
					aria-hidden="true"
					class="h-full w-full object-cover"
					src={`/eventImages/${recipe.image}`}
					alt="event image preview"
				/>
			</div>
		{:else}
			<div class="h-48 w-full overflow-hidden rounded-md">
				<img
					aria-hidden="true"
					class="h-full w-full object-cover"
					src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
					alt="event image preview"
				/>
			</div>
		{/if}

		<div class="my-2 flex w-full flex-col items-start">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<h2 class="text-left text-xl font-extrabold tracking-tight text-text">
						{recipe.name}
					</h2>
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

						{recipe.preparationTimeInMinutes} minutes
					</p>
					<p class="flex items-center gap-1 text-sm font-light text-gray-400">
						<Flame size={16} />

						{recipe.difficulty}
					</p>
				</div>
				<div class="flex gap-4">
					<div class="flex items-center gap-2">
						<ThumbsUp size={16} />
						{recipe.likes}
					</div>

					<div class="flex items-center gap-2">
						<ThumbsDown size={16} />
						{recipe.dislikes}
					</div>
				</div>
			</div>
		</div>
	</div>
</button>
