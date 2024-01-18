import { json } from '@sveltejs/kit';
import { addDoc, collection } from 'firebase/firestore';
import type { Commit } from '$lib';
import { db } from '../../../hooks.server';

export const POST = async ({ request, cookies }) => {
	const data = await request.json();
	const newCommit: Commit = data;

	const docRef = await addDoc(collection(db, 'commits'), newCommit);

	return json({ id: docRef.id });
};
