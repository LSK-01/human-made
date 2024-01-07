import type { Actions } from './$types';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, app } from '../hooks.server';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies, request }) => {
		const auth = getAuth(app);

		const data = await request.formData();
		let email: string = data.get('email') as string;
		let password: string = data.get('password') as string;

      let res;

      try{
        res = await signInWithEmailAndPassword(auth, email, password);
      }
      catch{
        res = await createUserWithEmailAndPassword(auth, email, password);
        //create a user document as well
        await setDoc(doc(db, 'users', res.user.uid), {});
      }

			let user = {
				email: email ?? '',
				uid: res.user.uid,
				username: res.user.displayName ?? email.substring(0, email.indexOf('@'))
      };

			cookies.set('user', JSON.stringify(user));
	}
} satisfies Actions;
