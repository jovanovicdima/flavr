import { RecipeRepository } from '$lib/repositories/RecipeRepository.js';
import { VoteRepository } from '$lib/repositories/VoteRepository.js';
import type { Actions } from '@sveltejs/kit';
import { error, fail } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.userEmail) {
		return fail(400);
	}

	const recipe = await RecipeRepository.getRecipe(params.id);

	if (recipe == null) {
		error(404, 'Event not found');
	}

	const vote = (await VoteRepository.getVotes(locals.userEmail, [recipe._id]))[0]?.like ?? null;

	return {
		recipe: recipe!,
		userEmail: locals.userEmail,
		vote
	};
};

export const actions: Actions = {};
