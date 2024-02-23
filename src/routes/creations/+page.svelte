<script lang="ts">
	import { Title, Button, Subtitle, Textfield, creations, CreationDiv, db } from '$lib';
	import type { Creation } from '$lib';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let startNew = false;

	let startNewClick = () => {
		startNew = !startNew;
	};

	export let data;
	let user = data.user;

	let addCreation = async (event: SubmitEvent) => {
		startNewClick();

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
			lastVisited: Timestamp.fromDate(new Date()),
			isVerified: true,
			percentage: 0,
			isFinished: false,
			started: Timestamp.fromDate(new Date()),
			username: user.username,
			tags: []
		};

		await addDoc(collection(db, 'creations'), newCreation);
	};

	onMount(() => {
		creations.update((items) => {
			return items.slice().sort((b, a) => {
				return +a.lastVisited.toDate() - +b.lastVisited.toDate();
			});
		});
	});
</script>

<svelte:head>
	<title>Creations</title>
</svelte:head>

<div>
	<Title>Creations</Title>

	<div class="mt-5">
		{#if startNew}
			<form on:submit={addCreation}>
				<div class="flex flex-col gap-5 pr-5">
					<div class="flex flex-row text-secondary flex-wrap items-center gap-2">
						<Subtitle>This creation is called</Subtitle>
						<input
							type="text"
							name="creationName"
							class="focus:outline-none border-b-4 border-secondary focus:ring focus:ring-secondary text-4xl font-bold text-primary"
						/>
						<Subtitle>and is</Subtitle>
						<select
							name="creationType"
							class="ml-3 w-52 h-11 border-secondary border-2 text-primary text-4xl font-bold focus:outline-none rounded-xl"
						>
							<option value="Visual">Visual</option>
							<option value="Auditory">Auditory</option>
							<option value="Written">Written</option>
						</select>
					</div>
					<div>
						<Textfield
							placeholder="Enter a short description about your new creation"
							name="creationDescription"
							size="lg"
						/>
					</div>
					<div class="flex flex-row gap-2">
						<Button size="md" icon="fa-brush">Create</Button>
						<Button size="md" submit={false} click={startNewClick} icon="fa-cancel">Cancel</Button>
					</div>
				</div>

			</form>
		{:else}
			<Button click={startNewClick} size="lg" icon="fa-plus">
				Start something new
			</Button>
		{/if}
	</div>

	{#each $creations as creation (creation.id)}
		<CreationDiv {creation}></CreationDiv>
	{/each}
</div>
