import type { User } from '$lib';
import type { Cookies } from '@sveltejs/kit';
import {redirect} from '@sveltejs/kit';

export function getUser(cookies: Cookies) {
	// Check cookie and return user object
	const cookie = cookies.get('user')!;

	if (cookie == null || cookie == undefined) {
		redirect(302, "/");
	}

	const user: User = JSON.parse(cookie);
	return user;
}
