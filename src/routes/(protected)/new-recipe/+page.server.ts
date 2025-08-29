import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { IngredientItem } from '$lib/models/IngredientItem';
import { randomUUID } from 'crypto';
import { RecipeRepository } from '$lib/repositories/RecipeRepository';
import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import type { NewRecipe } from '$lib/models/Recipe';

function getFormField<T extends string | number | boolean>(form: FormData, key: string): T | null {
	const value = form.get(key);

	if (value === null) return null;

	// Handle string specifically
	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed ? (trimmed as unknown as T) : null;
	}

	// Handle Blob or other types if needed (optional)
	return null;
}

function parseSteps(json: string): string[] | null {
	try {
		const parsed = JSON.parse(json);

		if (!Array.isArray(parsed)) return null;

		const steps: string[] = [];

		for (const step of parsed) {
			if (typeof step !== 'string') {
				return null;
			}

			steps.push(step);
		}

		return steps;
	} catch {
		return null;
	}
}

function parseIngredients(json: string): IngredientItem[] | null {
	try {
		const parsed = JSON.parse(json);

		if (!Array.isArray(parsed)) return null;

		const ingredients: IngredientItem[] = [];

		for (const ingredient of parsed) {
			if (
				typeof ingredient.ingredient !== 'string' ||
				typeof ingredient.quantity !== 'number' ||
				isNaN(ingredient.quantity) ||
				typeof ingredient.unit !== 'string' ||
				!ingredient.ingredient.trim() ||
				ingredient.quantity === 0 ||
				!ingredient.unit.trim()
			) {
				return null;
			}

			ingredients.push({
				ingredient: ingredient.ingredient.trim(),
				quantity: Number(ingredient.quantity),
				unit: ingredient.unit.trim()
			});
		}

		return ingredients;
	} catch {
		return null;
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.userEmail) {
			return fail(400);
		}

		const form = await request.formData();

		const name = getFormField<string>(form, 'name');
		const preparationTimeInMinutes = getFormField<number>(form, 'preparationTimeInMinutes');
		const difficulty = getFormField<string>(form, 'difficulty');
		const notes = getFormField<string>(form, 'notes');

		const rawImage = form.get('image');
		let image: File | null = null;

		if (rawImage instanceof File) {
			image = rawImage;
		}

		if (!name || !preparationTimeInMinutes || preparationTimeInMinutes < 1 || !difficulty) {
			return fail(400, { invalidInfo: true });
		}

		const rawStepsJson = form.get('stepsJson');
		if (typeof rawStepsJson !== 'string') {
			return fail(400, { invalidTicket: true });
		}

		const steps = parseSteps(rawStepsJson);
		if (!steps || steps.length === 0) {
			return fail(400, { invalidTicket: true });
		}

		const rawIngredientsJson = form.get('ingredientsJson');
		if (typeof rawIngredientsJson !== 'string') {
			console.log('raw ingred');
			return fail(400, { invalidTicket: true });
		}

		const ingredients = parseIngredients(rawIngredientsJson);
		if (!ingredients || ingredients.length === 0) {
			console.log(ingredients);
			return fail(400, { invalidTicket: true });
		}

		const newRecipe: NewRecipe = {
			name,
			preparationTimeInMinutes,
			difficulty,
			ingredients,
			steps,
			notes: notes ?? undefined,
			tags: []
		};

		if (image && image.size > 0 && image.name !== '') {
			const ext = image.name.split('.').pop();
			const filename = randomUUID() + '.' + ext;

			const uploadDir = path.join('static', 'eventImages');
			if (!existsSync(uploadDir)) {
				mkdirSync(uploadDir, { recursive: true });
			}

			// Save into static/eventImages/
			const buffer = Buffer.from(await image.arrayBuffer());
			const filePath = path.join(uploadDir, filename);
			writeFileSync(filePath, buffer);
			newRecipe.image = filename;
		}

		await RecipeRepository.createRecipe(newRecipe, locals.userEmail);
	}
};
