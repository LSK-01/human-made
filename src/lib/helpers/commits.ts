import { Listener, commits, type Commit } from "$lib";
import type { DocumentSnapshot, Query } from "firebase/firestore";

export function docToCommit(doc: DocumentSnapshot): Commit {
    const data = doc.data()!;
    const newCommit: Commit = {
        description: data.description,
        percentage: data.percentage,
        time: data.time,
        id: doc.id,
        uid: data.uid,
        creationId: data.creationId,
        evidence: data.evidence,
        hashes: data.hashes,
        blockchained: data.blockchained,
        tags: data.tags
    };

    return newCommit;
}


class CommitsListener extends Listener<Commit> {

    update(updatedCommit: Commit): void {
        commits.update((items) => {
            const index = items.findIndex((item) => item.id === updatedCommit.id);
            if (index !== -1) {
                return [...items.slice(0, index), updatedCommit, ...items.slice(index + 1)];
            }
            return items; // Return the original array if the item wasn't found
        });
    }

    remove(removedCommit: Commit): void {
        commits.update((items) => {
            const index = items.findIndex((item) => item.id === removedCommit.id);
            if (index !== -1) {
                return [...items.slice(0, index), ...items.slice(index + 1)];
            }
            return items; // Return the original array if the item wasn't found
        });
    }

    docToType(doc: DocumentSnapshot): Commit {
        return docToCommit(doc);
    }

    add(addedCommit: Commit): void {
        commits.update((items) => [addedCommit, ...items]);
    }
}

export const commitsListener = new CommitsListener();