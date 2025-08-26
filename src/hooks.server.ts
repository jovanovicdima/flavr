import { SessionRepository } from '$lib/repositories/SessionRepository';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const isProtected = event.route.id?.startsWith('/(protected)');

	if (!isProtected) {
		return await resolve(event);
	}

	const sessionID = event.cookies.get('session');

	if (!sessionID) {
		throw redirect(302, '/login');
	}

	const user = await SessionRepository.getSession(sessionID);

	if (!user) {
		throw redirect(302, '/login');
	}

	if (event.route.id?.startsWith('/(auth)/(protected)')) {
		throw redirect(302, '/');
	}

	event.locals.userEmail = user.email;
	return await resolve(event);
};
