import type { Timestamp } from "firebase/firestore";

export interface Creation {
    name: string,
    description: string,
    type: string,
    id?: string,
    uid: string,
    isVerified: boolean,
    lastVisited: Timestamp,
    percentage: number
}
