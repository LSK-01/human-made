import { json, type RequestHandler } from '@sveltejs/kit';
import { addDoc, collection, where, query, getDocs, limit } from 'firebase/firestore';
import { getUser, type User } from '$lib';
import type { Creation } from '$lib';
import {db} from '../../../hooks.server';

export const POST = async ({ request, cookies }) => {
	const data = await request.json();
	const newCreation: Creation = data;

    await addDoc(collection(db, 'creations'), newCreation);

	return json({ status: 200 });
};
