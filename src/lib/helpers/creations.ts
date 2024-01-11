import type { Creation } from "$lib";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";

export function docToCreation(id: string, data: DocumentData){
    const newCreation: Creation = {
        name: data.name,
        description: data.description,
        type: data.type,
        id: id,
        uid: data.uid,
        isNew: data.isNew,
        isVerified: data.isVerified
    };

    return newCreation;
}
