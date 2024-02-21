import { Listener, db, products} from "$lib";
import type { Product } from "$lib";
import { Query, collection, getDocs, limit, orderBy, query, where, type DocumentSnapshot } from "firebase/firestore";

export function docToProduct(doc: DocumentSnapshot): Product {
    const data = doc.data()!;
    const newCreation: Product = {
        name: data.name,
        description: data.description,
        type: data.type,
        id: doc.id,
        started: data.started,
        ended: data.ended,
        creator: data.username,
        likes: data.likes
    };

    return newCreation;
}

/* class ProductsListener extends Listener<Product> {

   update(updatedProduct: Product): void {
        products.update((items) => {
            const index = items.findIndex((item) => item.id === updatedProduct.id);
            if (index !== -1) {
                return [...items.slice(0, index), updatedProduct, ...items.slice(index + 1)];
            }
            return items; // Return the original array if the item wasn't found
        });
    }

    remove(removedProduct: Product): void {
        products.update((items) => {
            const index = items.findIndex((item) => item.id === removedProduct.id);
            if (index !== -1) {
                return [...items.slice(0, index), ...items.slice(index + 1)];
            }
            return items; // Return the original array if the item wasn't found
        });
    }

    docToType(doc: DocumentSnapshot): Product {
        return docToProduct(doc);
    }

    add(addedCreation: Product): void {
        products.update((items) => [addedCreation, ...items]);
    }
}

export const productsListener = new ProductsListener(); */
const recentsQuery = query(collection(db, 'marketplace') ,orderBy('started', 'desc'), limit(20));
const mostLikedQuery = query(collection(db, 'marketplace'), orderBy('likes', 'desc'), limit(20));
export const queries: {[key: string]: Query} = {'recents': recentsQuery, 'mostLiked': mostLikedQuery};

export async function loadMarketplace(q: Query) {
    const querySnap = await getDocs(q);
    let marketplace: Product[] = [];

    querySnap.forEach((doc) => {
        marketplace.push(docToProduct(doc));
    })

    return marketplace;
}