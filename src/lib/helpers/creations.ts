import { Listener, creations, type Creation } from "$lib";
import type { DocumentSnapshot } from "firebase/firestore";

export function docToCreation(doc: DocumentSnapshot): Creation {
    const data = doc.data()!;
    const newCreation: Creation = {
        name: data.name,
        description: data.description,
        type: data.type,
        id: doc.id,
        uid: data.uid,
        lastVisited: data.lastVisited,
        isVerified: data.isVerified,
        percentage: data.percentage,
        isFinished: data.isFinished,
        started: data.started,
        username: data.username,
        tags: data.tags
    };

    return newCreation;
}

class CreationsListener extends Listener<Creation> {

   update(updatedCreation: Creation): void {
        creations.update((items) => {
            const index = items.findIndex((item) => item.id === updatedCreation.id);
            if (index !== -1) {
                return [...items.slice(0, index), updatedCreation, ...items.slice(index + 1)];
            }
            return items; // Return the original array if the item wasn't found
        });
    }

    remove(removedCreation: Creation): void {
        creations.update((items) => {
            const index = items.findIndex((item) => item.id === removedCreation.id);
            if (index !== -1) {
                return [...items.slice(0, index), ...items.slice(index + 1)];
            }
            return items; // Return the original array if the item wasn't found
        });
    }

    docToType(doc: DocumentSnapshot): Creation {
        return docToCreation(doc);
    }

    add(addedCreation: Creation): void {
        creations.update((items) => [addedCreation, ...items]);
    }
}

export const creationsListener = new CreationsListener();