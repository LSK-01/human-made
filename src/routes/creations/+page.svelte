<script lang="ts">
	import { Title, Button, Subtitle, Textfield, creations, CreationDiv, docToCreation } from '$lib';
	import { query, collection, onSnapshot, where, limit } from 'firebase/firestore';
	import { db } from '$lib';
	import { onMount } from 'svelte';
	import type { Creation } from '$lib';
	import { json } from '@sveltejs/kit';

	let startNew = false;

	let startNewClick = () => {
		startNew = !startNew;
	};

	export let data;
	let user = data.user;

	onMount(() => {
        console.log('onmount run')
		const q = query(collection(db, 'creations'), where('uid', '==', user.uid), limit(30));
		const unsubscribe = onSnapshot(q, (snapshot) => {
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
			unsubscribe(); // Cleanup listener when the component is destroyed
		};
	});

	function updateCreation(updatedCreation: Creation) {
		creations.update((items) => {
			const index = items.findIndex((item) => item.id === updatedCreation.id);
			if (index !== -1) {
				return [...items.slice(0, index), updatedCreation, ...items.slice(index + 1)];
			}
			return items; // Return the original array if the item wasn't found
		});
	}

    function removeCreation(removedCreation: Creation){
        creations.update((items) => {
            const index = items.findIndex((item) => item.id === removedCreation.id);
            if (index !== -1) {
                return [...items.slice(0, index), ...items.slice(index + 1)];
            }
            return items; // Return the original array if the item wasn't found
        });
    }


    let addCreation = async (event: SubmitEvent) => {
        event.preventDefault(); // Prevents the default form submission

        const formData = new FormData(event.target as HTMLFormElement);

        const creationName = formData.get('creationName');
        const creationDescription = formData.get('creationDescription');
        const creationType = formData.get('creationType');

        const newCreation: Creation = {
            name: creationName as string,
            description: creationDescription as string,
            type: creationType as string,
            uid: user.uid,
            isNew: true,
            isVerified: true
        }

        // Send data to your server-side endpoint
        const response = await fetch('/api/addCreation', {
            method: 'POST',
            body: JSON.stringify(newCreation)
        });

        if (response.ok) {
            creations.update(items => [...items, newCreation]); // Update your store
        } else {
            console.error('Error submitting form');
        }
    }
</script>

<svelte:head>
	<title>Creations</title>
</svelte:head>

<div>
	<Title>Creations</Title>

	<div class="mt-5 ml-5">
		{#if startNew}
			<form on:submit={addCreation}>
				<div class="flex flex-row">
					<Subtitle>This creation is called</Subtitle>
					<input
						type="text"
						name="creationName"
						class="ml-5 mr-5 focus:outline-none border-b-4 border-secondary focus:ring focus:ring-secondary text-4xl font-bold text-primary"
					/>
					<Subtitle>and is</Subtitle>
					<select
						name="creationType"
						class="ml-3 w-52 h-11 border-secondary border-2 text-primary text-4xl font-bold focus:outline-none rounded-xl"
					>
						<option value="option1">Visual</option>
						<option value="option2">Auditory</option>
						<option value="option3">Written</option>
					</select>
				</div>
				<div class="mt-5">
					<Textfield
						placeholder="Enter a short description about your new creation"
						name="creationDescription"
						size="lg"
					/>
				</div>
				<div class=" mt-1">
					<Button size="md">Create</Button>
					<Button size="md" submit={false} click={startNewClick}>Cancel</Button>
				</div>
			</form>
		{:else}
			<Button click={startNewClick} size="lg">
				<i class="fas fa-plus text-xl mb-2"></i>
				Start something new
			</Button>
		{/if}
	</div>

	{#each $creations as creation (creation.id)}
		<CreationDiv {creation}></CreationDiv>
	{/each}
</div>
