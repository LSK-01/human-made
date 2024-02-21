import { Timestamp, collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc } from 'firebase/firestore';
import { db, docToCreation, type Creation, type Commit, type Product } from '$lib';
import { docToProduct } from '$lib';
import { queries, loadMarketplace } from '$lib';
export const load = async ({ params }) => {
    
    let marketplace = await loadMarketplace(queries.recents);
    return{
        marketplace: marketplace
	}
};
