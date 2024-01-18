import type { Timestamp } from "firebase/firestore"

export interface Commit {
    percentage: string,
    description: string,
    started: Timestamp,
    uid: string,
    id?: string
}
