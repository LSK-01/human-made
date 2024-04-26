import {getUser} from '$lib';

export const load = async ({ cookies, params }) => {
	return {user: getUser(cookies)};
}