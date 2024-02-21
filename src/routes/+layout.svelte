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

		orderBy

	} from 'firebase/firestore';
	import { creations, products } from '$lib';
	import { db } from '$lib';

	export let data;
	let user = data.user;

	import { creationsListener } from '$lib';

	onMount(() => {
		console.log('running onmount in +layout.svelte, attaching ccreations listener');
		creations.set([]);
		products.set([]);

		const creationsInstance = onSnapshot(query(collection(db, 'creations'), where('uid', '==', user.uid), limit(30))
, (snapshot) => {
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

		return () => {
			creationsInstance(); // Cleanup listener when the component is destroyed
			creations.set([]);
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
