import type { NewRecipe, Recipe, RecipeNoId } from '$lib/models/Recipe';
import { ObjectId } from 'mongodb';
import mongoFlavr from '$lib/mongo';
import dayjs from 'dayjs';

const recipesCollection = mongoFlavr.collection<Recipe>('recipes');
const recipesInsertCollection = mongoFlavr.collection<RecipeNoId>('recipes');

export class RecipeRepository {
	static async createRecipe(recipe: NewRecipe, postedBy: string) {
		const newRecipe: RecipeNoId = {
			...recipe,
			postedBy,
			postedAt: dayjs().toISOString(),
			likes: 0,
			dislikes: 0
		};

		await recipesInsertCollection.insertOne(newRecipe);
	}

	static async getRecipe(id: string): Promise<Recipe | null> {
		const [recipe] = await recipesCollection
			.aggregate<Recipe>([
				{ $match: { _id: new ObjectId(id) } },
				{ $addFields: { _id: { $toString: '$_id' } } }
			])
			.toArray();

		return recipe ?? null;
	}

	static async getRecipes(page = 1, pageSize = 10): Promise<Recipe[]> {
		const skip = (page - 1) * pageSize;

		return await recipesCollection
			.aggregate<Recipe>([
				{ $sort: { postedAt: -1 } },
				{ $skip: skip },
				{ $limit: pageSize },
				{ $addFields: { _id: { $toString: '$_id' } } }
			])
			.toArray();
	}

	static async updateRecipe(id: string, recipe: Partial<NewRecipe>): Promise<boolean> {
		const result = await recipesInsertCollection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: recipe }
		);
		return result.modifiedCount > 0;
	}

	static async deleteRecipe(id: string): Promise<boolean> {
		const result = await recipesInsertCollection.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount > 0;
	}

	static async voteRecipe(
		id: string,
		currentVote: boolean | null,
		previousVote: boolean | null
	): Promise<boolean> {
		let update: { $inc: { likes: number } } | { $inc: { dislikes: number } };

		if (previousVote === null && currentVote !== null) {
			update = currentVote ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
		} else if (previousVote !== null && currentVote === null) {
			update = previousVote ? { $inc: { likes: -1 } } : { $inc: { dislikes: -1 } };
		} else if (previousVote !== null && currentVote !== null && previousVote !== currentVote) {
			update = currentVote
				? { $inc: { likes: 1, dislikes: -1 } }
				: { $inc: { likes: -1, dislikes: 1 } };
		} else {
			return true;
		}

		const result = await recipesInsertCollection.updateOne({ _id: new ObjectId(id) }, update);

		return result.modifiedCount > 0;
	}
}
