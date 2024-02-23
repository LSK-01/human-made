import type { Timestamp } from "firebase/firestore"

export interface Commit {
    percentage: number,
    description: string,
    time: Timestamp,
    uid: string,
    id?: string,
    creationId: string,
    evidence: { [key: string]: string },
    hashes: string[],
    blockchained: boolean,
    tags: { [key: string]: number },
    usedAI: boolean
}

export interface Creation {
    name: string,
    description: string,
    type: string,
    id?: string,
    uid: string,
    isVerified: boolean,
    lastVisited: Timestamp,
    percentage: number,
    isFinished: boolean,
    started: Timestamp,
    username: string,
    tags: string[]
}

export interface Product{
    name: string,
    type: string,
    description: string,
    creator: string,
    started: Timestamp,
    ended: Timestamp,
    id?: string,
    likes: number
}

export interface User{
    email: string,
    uid: string,
    username: string
}