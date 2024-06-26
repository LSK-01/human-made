import type { Actions } from './$types';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import {db, app} from '../hooks.server';
import { doc, setDoc } from 'firebase/firestore';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request }) => {
		const auth = getAuth(app);

		const data = await request.formData();
		let email: string = data.get('email') as string;
		let password: string = data.get('password') as string;

		let res;

		try {
			res = await signInWithEmailAndPassword(auth, email, password);
		} catch {
			try{
				res = await createUserWithEmailAndPassword(auth, email, password);
			}
			catch {
				redirect(302, '/login');
				return;
			}
			//create a user document as well
			await setDoc(doc(db, 'users', res.user.uid), {username: res.user.displayName ?? email.substring(0, email.indexOf('@'))});
		}

		let user = {
			email: email ?? '',
			uid: res.user.uid,
			username: res.user.displayName ?? email.substring(0, email.indexOf('@'))
		};

		cookies.set('user', JSON.stringify(user));
	},

	logout: async ({ cookies, request }) => {
		cookies.set('user', '');
	}
} satisfies Actions;
