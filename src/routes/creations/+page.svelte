<script lang="ts">
	import { Title, Button, Subtitle, Textfield, creations, CreationDiv } from '$lib';
	import type { Creation } from '$lib';

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
			isVerified: true
		};

		const response = await fetch('/api/addCreation', {
			method: 'POST',
			body: JSON.stringify(newCreation)
		});

		if (response.ok) {
			console.log('Form sent!');
		} else {
			console.error('Error submitting form');
		}
	};
</script>

<svelte:head>
	<title>Creations</title>
</svelte:head>

<div>
	<Title>Creations</Title>

	<div class="mt-5">
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
						<option value="Visual">Visual</option>
						<option value="Auditory">Auditory</option>
						<option value="Written">Written</option>
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
