import type { Timestamp } from "firebase/firestore"

export interface Commit {
    percentage: number,
    description: string,
    time: Timestamp,
    uid: string,
    id?: string,
    creationId: string,
    evidence: { [key: string]: string }
}
