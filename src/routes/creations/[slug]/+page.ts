import { doc, getDoc } from 'firebase/firestore';
import { db } from '$lib';

export const load = async ({ params }) => {
	const docRef = doc(db, 'creations', params.slug);
	const docSnap = await getDoc(docRef);

	//document snapshot is not serialisable so we use universal load func.
	return{
		creation: docSnap,
		creationId: params.slug
	}
};
