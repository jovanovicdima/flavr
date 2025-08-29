import type { IngredientItem } from './IngredientItem';

export interface Recipe {
	_id: string;
	name: string;
	preparationTimeInMinutes: number;
	difficulty: string;
	ingredients: IngredientItem[];
	steps: string[];
	postedBy: string;
	postedAt: string;
	image?: string;
	likes: number;
	dislikes: number;
	notes?: string;
	tags: string[];
}

export type NewRecipe = Omit<Recipe, '_id' | 'postedAt' | 'postedBy' | 'likes' | 'dislikes'>;

export type RecipeNoId = Omit<Recipe, '_id'>;
