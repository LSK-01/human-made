import type { Commit } from "$lib";
import type { DocumentSnapshot } from "firebase/firestore";

export function docToCommit(doc: DocumentSnapshot): Commit {
    const data = doc.data()!;
    const newCreation: Commit = {
        description: data.description,
        percentage: data.percentage,
        started: data.started,
        id: doc.id,
        uid: data.uid,
    };

    return newCreation;
}