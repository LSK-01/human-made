import type { Creation } from "$lib";
import type { DocumentSnapshot } from "firebase/firestore";

export function docToCreation(doc: DocumentSnapshot): Creation {
    const data = doc.data()!;
    const newCreation: Creation = {
        name: data.name,
        description: data.description,
        type: data.type,
        id: doc.id,
        uid: data.uid,
        isVerified: data.isVerified
    };

    return newCreation;
}