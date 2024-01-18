import type { Timestamp } from "firebase/firestore"

export interface Commit {
    percentage: string,
    description: string,
    time: Timestamp,
    uid: string,
    id?: string,
    creationId: string
}
