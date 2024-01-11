import type { Actions } from './$types';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import {db} from '../hooks.server';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { redirect } from '@sveltejs/kit';
import {getUser} from '$lib';

export const load = async ({ cookies, params }) => {
	return {user: getUser(cookies)};
}