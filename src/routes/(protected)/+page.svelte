<script lang="ts">
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const recipes = data.recipes;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<section class="my-4 flex w-full flex-col items-center">
	<div class="mx-2 min-h-screen w-full space-y-4">
		<h1 class="text-center text-3xl font-bold">Upcoming Events</h1>

		<div class="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-4 px-4">
			{#each recipes as recipe}
				<RecipeCard {recipe} />
				<RecipeCard {recipe} />
				<RecipeCard {recipe} />
				<RecipeCard {recipe} />
				<RecipeCard {recipe} />
				<RecipeCard {recipe} />
				<RecipeCard {recipe} />
			{/each}
		</div>
	</div>
</section>
