import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

function getStringField(form: FormData, key: string): string | null {
	const value = form.get(key);
	return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function parseTickets(json: string): NewTicket[] | null {
	try {
		const parsed = JSON.parse(json);

		if (!Array.isArray(parsed)) return null;

		const tickets: NewTicket[] = [];

		for (const t of parsed) {
			if (
				typeof t.name !== 'string' ||
				typeof t.count === 'undefined' ||
				typeof t.price === 'undefined' ||
				isNaN(Number(t.count)) ||
				isNaN(Number(t.price)) ||
				!t.name.trim() ||
				t.price === 0 ||
				t.count === 0
			) {
				return null;
			}

			tickets.push({
				name: t.name.trim(),
				count: Number(t.count),
				price: Number(t.price)
			});
		}

		return tickets;
	} catch {
		return null;
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.userEmail) {
			return fail(400);
		}

		const form = await request.formData();

		const title = getStringField(form, 'title');
		const description = getStringField(form, 'description');
		const location = getStringField(form, 'location');
		const date = getStringField(form, 'date');
		const time = getStringField(form, 'time');

		const rawImage = form.get('image');
		let image: File | null = null;

		if (rawImage instanceof File) {
			image = rawImage;
		}

		if (!title || !description || !location || !date || !time) {
			return fail(400, { invalidInfo: true });
		}

		const rawTicketsJson = form.get('ticketsJson');
		if (typeof rawTicketsJson !== 'string') {
			return fail(400, { invalidTicket: true });
		}
	}
};
