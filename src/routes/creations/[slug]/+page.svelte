<script lang="ts">
	import {
		Title,
		Button,
		Subtitle,
		Textfield,
		creations,
		CreationDiv,
		docToCreation,
		Slider,
        Info
	} from '$lib';
	import type { Creation } from '$lib';
	export let data;
	let user = data.user;
	let creation: Creation = docToCreation(data.creation);

	let sliderVal = 50;

	let addingProcess = false;
	let toggleAddingProcess = () => {
		addingProcess = !addingProcess;
	};

	let addProcess = () => {
		toggleAddingProcess();
	};

    let addEvidence = () => {

    }
</script>

<svelte:head>
	<title>{creation.name}</title>
</svelte:head>

<div class="flex flex-row gap-10 items-baseline">
	<Title>{creation.name}</Title>
	<span class="text-tertiary"><Subtitle>{creation.type}</Subtitle></span>
</div>
{#if true}
	<form on:submit={addProcess} class="flex flex-col gap-5 mt-5">
		<div class="flex flex-row items-baseline text-secondary">
			<Subtitle>I am</Subtitle>
			<Slider />
			<Subtitle>complete</Subtitle>
		</div>
        <Info 
        click={addEvidence} 
        infoText="Upload drafts (screen recordings, screenshots, photos) of work completed since your last commit."
        buttonText="Upload Evidence"
        />
		<div>
			<Textfield
				placeholder="Enter a short description about progress since your last log."
				name="creationDescription"
				size="lg"
			/>
		</div>
		<div class="">
			<Button size="md" click={addProcess}>Commit</Button>
			<Button size="md" submit={false} click={toggleAddingProcess}>Cancel</Button>
		</div>
	</form>
{:else}
	<Button click={toggleAddingProcess} size="lg">
		<i class="fas fa-plus text-xl mb-2"></i>
		Log Creative Process
	</Button>
{/if}
<div class="mt-10 text-secondary">
	<Subtitle>Progress Timeline</Subtitle>
</div>
