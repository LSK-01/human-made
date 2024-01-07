export const load = async ({ cookies, params }) => {
	// Check cookie and return user object
	const cookie = cookies.get('user')!;

    if (cookie == null || cookie == undefined) {
        return {
			user: null,
		};
    }

    const user = JSON.parse(cookie);
    return {
        user: user,
    };
};
