import type { Timestamp } from "firebase/firestore";

export interface Market{
    name: string,
    type: string,
    description: string,
    creator: string,
    started: Timestamp,
    ended: Timestamp

}