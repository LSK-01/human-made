import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '$lib';

export const load = async ({ params }) => {
	//update lastVisited for this creation
	const docRef = doc(db, 'creations', params.slug);
	await updateDoc(docRef, {lastVisited: Timestamp.fromDate(new Date())});

	const docSnap = await getDoc(docRef);

	//document snapshot is not serialisable so we use universal load func.
	return{
		creation: docSnap,
		creationId: params.slug
	}
};
