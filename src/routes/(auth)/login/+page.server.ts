import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UserRepository } from '$lib/repositories/UserRepository';
import { SessionRepository } from '$lib/repositories/SessionRepository';

export const load: PageServerLoad = async (event) => {
	if (event.locals.userEmail) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();

		const email = data.get('email');
		const password = data.get('password');

		if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
			return fail(400, { invalid: true });
		}

		// user entered email
		const validateUser = await UserRepository.validateUser(email, password);

		// if wrong credentials
		if (validateUser === false) {
			return fail(400, { credentials: true });
		}

		const sessionID = await SessionRepository.createSession(email);

		cookies.set('session', sessionID, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60
		});
		throw redirect(302, '/');
	}
};
