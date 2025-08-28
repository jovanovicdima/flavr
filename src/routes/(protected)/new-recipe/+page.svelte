<script lang="ts">
	import { enhance } from '$app/forms';
	import type { IngredientItem } from '$lib/models/IngredientItem';
	import { UNITS } from '$lib/models/Units';
	import { onMount } from 'svelte';

	let name = $state('');
	let preparationTimeInMinutes = $state<number | null>(null);
	let difficulty = $state('');
	let ingredients: IngredientItem[] = $state([]);
	let steps: string[] = $state([]);
	let image: File | null = $state(null);
	let notes = $state('');

	let isError = $derived.by(() => {
		if (
			name === '' ||
			preparationTimeInMinutes === null ||
			preparationTimeInMinutes <= 0 ||
			difficulty === '' ||
			steps.length < 1 ||
			ingredients.length < 1
		) {
			return true;
		}

		for (const step of steps) {
			if (step === '') {
				return true;
			}
		}

		for (const ingredientItem of ingredients) {
			if (ingredientItem.ingredient === '' || ingredientItem.quantity <= 0) {
				return true;
			}
		}

		return false;
	});

	function addIngredient() {
		ingredients.push({ ingredient: '', quantity: 0, unit: 'g' });
	}

	function removeIngredient(index: number) {
		ingredients.splice(index, 1);
	}

	function addStep() {
		steps.push('');
	}

	function removeStep(index: number) {
		steps.splice(index, 1);
	}

	function autoResize(event: Event) {
		const el = event.target as HTMLTextAreaElement;
		el.style.height = 'auto'; // Reset height
		el.style.height = el.scrollHeight + 'px'; // Set to scroll height
	}

	onMount(() => {
		// Optionally resize all on load
		document.querySelectorAll('textarea').forEach((el) => {
			el.style.height = 'auto';
			el.style.height = el.scrollHeight + 'px';
		});
	});
</script>

<form
	method="POST"
	use:enhance={() => {
		// Reset reactive state after successful submission
		name = '';
		preparationTimeInMinutes = null;
		difficulty = '';
		ingredients = [];
		steps = [];
		image = null;
		notes = '';
	}}
	class="mx-auto max-w-xl space-y-16 rounded-xl p-6 shadow-md"
	enctype="multipart/form-data"
>
	<div class="space-y-4">
		<h1 class="text-center text-2xl font-bold">Create Recipe</h1>
		<input
			type="text"
			name="name"
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
			class="w-full rounded border bg-background p-2"
			min="0"
			oninput={(event) => {
				const el = event.target as HTMLInputElement;
				const value = el.valueAsNumber;
				preparationTimeInMinutes = isNaN(value) ? null : value;
			}}
			required
		/>

		<select
			name="difficulty"
			placeholder="Difficulty"
			bind:value={difficulty}
			class="w-full rounded border bg-background p-2 invalid:text-gray-400"
			required
		>
			<option value="" disabled selected hidden>Select difficulty</option>
			<option value="Very Easy">Very Easy</option>
			<option value="Easy">Easy</option>
			<option value="Medium">Medium</option>
			<option value="Hard">Hard</option>
			<option value="Very Hard">Very Hard</option>
		</select>
	</div>

	<input type="hidden" name="ingredientsJson" value={JSON.stringify(ingredients)} />
	<div>
		<h2 class="mb-2 text-center text-2xl font-semibold">Ingredients</h2>
		<div class="space-y-2">
			{#each ingredients as ingredient, i}
				<div class="flex space-x-1">
					<input
						type="text"
						bind:value={ingredient.ingredient}
						placeholder="Ingredient"
						class="flex-1 rounded border bg-background p-2 placeholder-gray-400"
					/>
					<input
						type="number"
						inputmode="numeric"
						min="0"
						bind:value={ingredient.quantity}
						oninput={(event) => {
							const el = event.target as HTMLInputElement;
							const value = el.valueAsNumber;
							ingredient.quantity = isNaN(value) ? 0 : value;
						}}
						placeholder="Quantity"
						class="w-24 rounded border bg-background p-2 placeholder-gray-400"
					/>
					<select bind:value={ingredient.unit} class="rounded border bg-background p-2">
						<option disabled>Select unit</option>
						{#each UNITS as { label, value }}
							<option {value}>{label}</option>
						{/each}
					</select>
					<button
						type="button"
						onclick={() => removeIngredient(i)}
						class="cursor-pointer px-2 text-red-500">✕</button
					>
				</div>
			{/each}
		</div>

		<button
			type="button"
			onclick={addIngredient}
			class="mt-2 cursor-pointer text-primary-500 hover:text-primary-600">+ Add Ingredient</button
		>
	</div>

	<input type="hidden" name="stepsJson" value={JSON.stringify(steps)} />
	<div>
		<h2 class="mb-2 text-center text-2xl font-semibold">Steps</h2>
		<div class="space-y-2">
			{#each steps as _, i}
				<div class="flex items-center gap-2 space-x-2">
					{`Step ${i + 1}:`}
					<textarea
						bind:value={steps[i]}
						placeholder="Step Description"
						class="flex-1 resize-none rounded border bg-background p-2 placeholder-gray-400"
						rows="1"
						oninput={autoResize}
					></textarea>

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
