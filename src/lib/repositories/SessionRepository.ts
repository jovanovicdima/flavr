import type { Session } from '$lib/models/Session';
import type { User } from '$lib/models/User';
import mongoFlavr from '$lib/mongo';
import dayjs from 'dayjs';

const sessionsCollection = mongoFlavr.collection<Session>('sessions');

export class SessionRepository {
	static async createSession(email: string, expiresInSeconds: number = 60 * 60): Promise<string> {
		const sessionID = crypto.randomUUID();
		await sessionsCollection.updateOne(
			{
				email
			},
			{
				$set: {
					sessionID,
					email,
					createdAt: new Date(),
					expiresAt: dayjs().add(expiresInSeconds, 'second').toDate()
				}
			},
			{ upsert: true }
		);
		return sessionID;
	}

	static async getSession(sessionID: string): Promise<User | null> {
		const userProjection: Record<keyof User, 1 | string> = {
			_id: '$user._id',
			email: '$user.email'
		};

		const result = await sessionsCollection
			.aggregate<User>([
				{
					$match: {
						sessionID: sessionID,
						expiresAt: { $gt: new Date() }
					}
				},
				{
					$lookup: {
						from: 'users',
						localField: 'email',
						foreignField: 'email',
						as: 'user'
					}
				},
				{
					$unwind: '$user'
				},
				{
					$project: userProjection
				}
			])
			.toArray();

		return result.length > 0 ? result[0] : null;
	}
}
