import type { Commit } from "$lib";
import type { DocumentSnapshot } from "firebase/firestore";

export function docToCommit(doc: DocumentSnapshot): Commit {
    const data = doc.data()!;
    const newCommit: Commit = {
        description: data.description,
        percentage: data.percentage,
        time: data.time,
        id: doc.id,
        uid: data.uid,
        creationId: data.creationId
    };

    return newCommit;
}