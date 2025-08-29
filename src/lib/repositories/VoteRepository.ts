import type { Vote } from '$lib/models/Vote';
import mongoFlavr from '$lib/mongo';

const votesCollection = mongoFlavr.collection<Vote>('votes');

export class VoteRepository {
	static async vote(email: string, recipeId: string, vote: boolean | null): Promise<boolean> {
		if (vote === null) {
			const result = await votesCollection.deleteOne({ recipeId, email });
			return result.deletedCount > 0;
		}

		const result = await votesCollection.updateOne(
			{ recipeId, email },
			{ $set: { like: vote } },
			{ upsert: true }
		);
		return result.modifiedCount > 0;
	}

	static async getVotes(email: string, recipeIds: string[]): Promise<Vote[]> {
		return await votesCollection
			.find({
				email,
				recipeId: { $in: recipeIds }
			})
			.toArray();
	}
}
