import { Timestamp, collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db, docToCreation, type Creation, type Commit } from '$lib';
import { docToCommit } from '$lib/helpers/commits.js';

export const load = async ({ params }) => {
	const creationSnap = await getDoc(doc(db, 'creations', params.slug));
	let creation: Creation = docToCreation(creationSnap);

	//document snapshot is not serialisable so we use universal load func.
	return{
		creation: creation
	}
};
