// src/routes/api/vote/+server.ts
import { RecipeRepository } from '$lib/repositories/RecipeRepository.js';
import { VoteRepository } from '$lib/repositories/VoteRepository';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const email = locals.userEmail;
	if (!email) {
		throw error(401, 'User not authenticated');
	}

	const { recipeId, like } = await request.json();

	if (!recipeId || typeof like !== 'boolean') {
		throw error(400, 'Invalid request');
	}

	const previousVote: boolean = (await VoteRepository.getVotes(email, [recipeId]))[0]?.like ?? null;

	const currentVote = like === (previousVote ?? null) ? null : like;

	console.log(previousVote, currentVote);

	await RecipeRepository.voteRecipe(recipeId, currentVote, previousVote);
	await VoteRepository.vote(email, recipeId, currentVote);

	return json({ success: true });
};
