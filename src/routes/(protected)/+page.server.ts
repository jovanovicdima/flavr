import { RecipeRepository } from '$lib/repositories/RecipeRepository';

export const prerender = true;

export const load = async () => {
	const recipes = await RecipeRepository.getRecipes(1, 10);

	console.log(recipes);

	return {
		recipes: recipes
	};
};
