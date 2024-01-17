import type { Timestamp } from "firebase/firestore";

export interface Market{
    name: string,
    description: string,
    creator: string,
    started: Timestamp,
    ended: Timestamp

}