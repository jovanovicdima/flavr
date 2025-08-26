import type { UserWithPassword, User } from '$lib/models/User';
import mongoFlavr from '$lib/mongo';
import bcrypt from 'bcrypt';

const usersCollection = mongoFlavr.collection<UserWithPassword>('users');

export class UserRepository {
	static async createUser(email: string, password: string) {
		await usersCollection.insertOne({
			email,
			password: await bcrypt.hash(password, 10)
		});
	}

	static async validateUser(email: string, password: string): Promise<boolean> {
		const user: UserWithPassword | null = await usersCollection.findOne(
			{ email },
			{ projection: { password: 1 } }
		);

		if (!user) {
			return false;
		}

		return await bcrypt.compare(password, user.password);
	}

	static async getUserByEmail(email: string): Promise<User | null> {
		const user: User | null = await usersCollection.findOne(
			{ email },
			{ projection: { password: 0 } }
		);
		return user;
	}

	static async isEmailInUse(email: string): Promise<boolean> {
		const user: User | null = await usersCollection.findOne(
			{ email },
			{ projection: { password: 0 } }
		);
		return user !== null;
	}
}
