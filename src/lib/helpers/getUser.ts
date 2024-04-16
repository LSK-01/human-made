import type { User } from '$lib';
import type { Cookies } from '@sveltejs/kit';
import {redirect} from '@sveltejs/kit';

export function getUser(cookies: Cookies) {
	// Check cookie and return user object
	const cookie = cookies.get('user')!;
	let user: User | null = null;
	if (cookie == null || cookie == undefined || cookie == '') {
		redirect(302, "/");
	}
	else{
		user = JSON.parse(cookie);

	}
	return user;
}
