<script lang="ts">
	import '../tailwind.css';
	const fontAwesomePath = import.meta.env.VITE_FONTAWESOME_PATH;
	import { Sidebar } from '$lib';
	import { onMount } from 'svelte';
	import { query, collection, onSnapshot, where, limit } from 'firebase/firestore';
	import { docToCreation, creations } from '$lib';
	import type { Creation } from '$lib';
	import { db } from '$lib';

	export let data;
	let user = data.user;

	const creationsQuery = query(
		collection(db, 'creations'),
		where('uid', '==', user.uid),
		limit(30)
	);

	function updateCreation(updatedCreation: Creation) {
		creations.update((items) => {
			const index = items.findIndex((item) => item.id === updatedCreation.id);
			if (index !== -1) {
				return [...items.slice(0, index), updatedCreation, ...items.slice(index + 1)];
			}
			return items; // Return the original array if the item wasn't found
		});
	}

	function removeCreation(removedCreation: Creation) {
		creations.update((items) => {
			const index = items.findIndex((item) => item.id === removedCreation.id);
			if (index !== -1) {
				return [...items.slice(0, index), ...items.slice(index + 1)];
			}
			return items; // Return the original array if the item wasn't found
		});
	}

	onMount(() => {       
        console.log('running onmount'); 
		const creationsListener = onSnapshot(creationsQuery, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const creation = docToCreation(change.doc.id, change.doc.data());
				if (change.type === 'added') {
					console.log('New creation: ', change.doc.data());
					creations.update((items) => [creation, ...items]);
				}
				if (change.type === 'modified') {
					console.log('Modified creation: ', change.doc.data());
					updateCreation(creation);
				}
				if (change.type === 'removed') {
					console.log('removed creation: ', change.doc.data());
					removeCreation(creation);
				}
			});
		});

		return () => {
			creationsListener(); // Cleanup listener when the component is destroyed
            creations.set([]);
		};
	});
</script>

<svelte:head>
	<link rel="stylesheet" href={fontAwesomePath} />
</svelte:head>

<main class="flex">
	<Sidebar />
	<div class="flex-grow ml-44">
		<slot />
	</div>
</main>
