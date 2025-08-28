import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import type { IngredientItem } from '$lib/models/IngredientItem';

function getFormField<T extends string | number | boolean>(
	form: FormData,
	key: string
  ): T | null {
	const value = form.get(key);
  
	if (value === null) return null;
  
	// Handle string specifically
	if (typeof value === "string") {
	  const trimmed = value.trim();
	  return (trimmed ? (trimmed as unknown as T) : null);
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
				typeof ingredient.unit === 'string' ||
				typeof ingredient.count === 'undefined' ||
				isNaN(Number(ingredient.count)) ||
				!ingredient.ingredient.trim() ||
				!ingredient.unit.trinm() ||
				ingredient.count === 0
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

		console.log(name, preparationTimeInMinutes, difficulty, notes)

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

		console.log(ingredients)
	}
};
