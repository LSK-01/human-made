import type { Actions } from './$types';
import {db} from '../../hooks.server';
import { addDoc, collection, where, query, getDocs, limit } from 'firebase/firestore';
import { getUser, type User } from '$lib';
import { creations } from '$lib';
import type { Creation } from '$lib';

export const actions = {
	default: async ({ cookies, request }) => {
		const user: User = getUser(cookies);

		const data = await request.formData();

		const newCreation: Creation = {
			name: data.get('creationName') as string,
			description: data.get('creationDescription') as string,
			type: data.get('creationType') as string,
			uid: user.uid,
			isVerified: false,
			isNew: true
		}

		await addDoc(collection(db, 'creations'), newCreation);
	}
} satisfies Actions;

export const load = async ({ cookies, params }) => {
	const user = getUser(cookies) ?? { uid: '' };

	const q = query(collection(db, 'creations'), where('uid', '==', user.uid), limit(10));

	const querySnapshot = await getDocs(q);
	const newCreations: Creation[] = [];

	querySnapshot.forEach((doc) => {
		const newCreation: Creation = {
			name: doc.data().name,
			description: doc.data().description,
			type: doc.data().type,
			id: doc.id,
			uid: doc.data().uid,
			isNew: false,
			isVerified: false
		};

		newCreations.push(newCreation);
	});

	return {
		newCreations: newCreations
	};
};
