<script lang="ts">
	import '../tailwind.css';
	const fontAwesomePath = import.meta.env.VITE_FONTAWESOME_PATH;
	import { Sidebar } from '$lib';
	import { onMount } from 'svelte';
	import {
		query,
		collection,
		onSnapshot,
		where,
		limit,
		DocumentSnapshot,
		type DocumentData,
		Query
	} from 'firebase/firestore';
	import { commits, creations, Listener, docToCreation } from '$lib';
	import type { Commit, Creation } from '$lib';
	import { db } from '$lib';
	import type { RollupCommonJSOptions } from 'vite';
	import { docToCommit } from '$lib/helpers/commits';

	export let data;
	let user = data.user;

	class CreationsListener extends Listener<Creation> {
		constructor(query: Query) {
			super(query);
		}

		update(updatedCreation: Creation): void {
			creations.update((items) => {
				const index = items.findIndex((item) => item.id === updatedCreation.id);
				if (index !== -1) {
					return [...items.slice(0, index), updatedCreation, ...items.slice(index + 1)];
				}
				return items; // Return the original array if the item wasn't found
			});
		}

		remove(removedCreation: Creation): void {
			creations.update((items) => {
				const index = items.findIndex((item) => item.id === removedCreation.id);
				if (index !== -1) {
					return [...items.slice(0, index), ...items.slice(index + 1)];
				}
				return items; // Return the original array if the item wasn't found
			});
		}

		docToType(doc: DocumentSnapshot): Creation {
			return docToCreation(doc);
		}

		add(addedCreation: Creation): void {
            creations.update((items) => [addedCreation, ...items]);
        }
	}

	class CommitsListener extends Listener<Commit> {
		constructor(query: Query) {
			super(query);
		}

		update(updatedCommit: Commit): void {
			commits.update((items) => {
				const index = items.findIndex((item) => item.id === updatedCommit.id);
				if (index !== -1) {
					return [...items.slice(0, index), updatedCommit, ...items.slice(index + 1)];
				}
				return items; // Return the original array if the item wasn't found
			});
		}

		remove(removedCommit: Commit): void {
			commits.update((items) => {
				const index = items.findIndex((item) => item.id === removedCommit.id);
				if (index !== -1) {
					return [...items.slice(0, index), ...items.slice(index + 1)];
				}
				return items; // Return the original array if the item wasn't found
			});
		}

		docToType(doc: DocumentSnapshot<DocumentData, DocumentData>): Commit {
			return docToCommit(doc);
		}

        add(addedCommit: Commit): void {
            commits.update((items) => [addedCommit, ...items]);
        }
	}

	const commitsListener = new CommitsListener(
		query(collection(db, 'commits'), where('uid', '==', user.uid), limit(30))
	);
	const creationsListener = new CreationsListener(
		query(collection(db, 'creations'), where('uid', '==', user.uid), limit(30))
	);

	onMount(() => {
		console.log('running onmount in +layout.svelte');
		creations.set([]);
		commits.set([]);

		const creationsInstance = onSnapshot(creationsListener.query, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const creation = creationsListener.docToType(change.doc);
				if (change.type === 'added') {
					console.log('New creation: ', change.doc.data());
					creationsListener.add(creation);
				}
				if (change.type === 'modified') {
					console.log('Modified creation: ', change.doc.data());
					creationsListener.update(creation);
				}
				if (change.type === 'removed') {
					console.log('removed creation: ', change.doc.data());
					creationsListener.remove(creation);
				}
			});
		});

		const commitsInstance = onSnapshot(commitsListener.query, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const commit = commitsListener.docToType(change.doc);
				if (change.type === 'added') {
					console.log('New commit: ', change.doc.data());
					commitsListener.add(commit);
				}
				if (change.type === 'modified') {
					console.log('Modified commit: ', change.doc.data());
					commitsListener.update(commit);
				}
				if (change.type === 'removed') {
					console.log('removed commit: ', change.doc.data());
					commitsListener.remove(commit);
				}
			});
		});

		return () => {
			creationsInstance(); // Cleanup listener when the component is destroyed
			commitsInstance();
			creations.set([]);
			commits.set([]);
		};
	});
</script>

<svelte:head>
	<link rel="stylesheet" href={fontAwesomePath} />
</svelte:head>

<main class="flex">
	<Sidebar />
	<div class="flex-grow ml-48 mt-5">
		<slot />
	</div>
</main>
