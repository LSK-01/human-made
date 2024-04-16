import type { DocumentSnapshot, Query } from "firebase/firestore";

abstract class Listener<T>{
    abstract update(struct: T): void;
    abstract remove(struct: T): void;
    abstract add(struct: T): void;
    abstract docToType(doc: DocumentSnapshot): T;
}

export default Listener;