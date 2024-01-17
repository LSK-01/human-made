import type { Timestamp } from "firebase/firestore"

export interface Commit {
    percentage: string,
    description: string,
    started: Timestamp,
    evidence: [string]
}
