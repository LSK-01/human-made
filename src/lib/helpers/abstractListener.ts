import type { DocumentSnapshot, Query } from "firebase/firestore";

abstract class Listener<T>{
    query: Query;
    abstract update(struct: T): void;
    abstract remove(struct: T): void;
    abstract docToType(doc: DocumentSnapshot): T;

    constructor(query: Query){
        this.query = query;
    }
}

export default Listener;