import type { Session } from '$lib/models/Session';
import type { User } from '$lib/models/User';
import mongoFlavr from '$lib/mongo';
import dayjs from 'dayjs';
import { UserRepository } from './UserRepository';

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
		const session = await sessionsCollection.findOne({
			sessionID: sessionID,
			expiresAt: { $gt: new Date() }
		});

		if (!session) {
			return null;
		}

		const user = await UserRepository.getUserByEmail(session.email);

		return user;
	}
}
