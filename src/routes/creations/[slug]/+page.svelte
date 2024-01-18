<script lang="ts">
	import {
		Title,
		Button,
		Subtitle,
		Textfield,
		commits,
		Slider,
		Info,
		docToCreation,
		db
	} from '$lib';
	import type { Commit, Creation } from '$lib';
	export let data;
	let user = data.user;
	let creationId = data.creationId;

	let creation: Creation = docToCreation(data.creation);
	import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';

	let selectedFiles: FileList;
	let addingProcess = false;


	let toggleAddingProcess = () => {
		addingProcess = !addingProcess;
        const fileInput = document.getElementById('fileInput')! as HTMLInputElement;
        fileInput.value = '';
	};

	let addProcess = async (event: SubmitEvent) => {
		toggleAddingProcess();

		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		const commitDescription = formData.get('commitDescription');
		const sliderValue = document.getElementById('sliderValue')?.innerText;

		const newCommit: Commit = {
			description: commitDescription as string,
			uid: user.uid,
			percentage: sliderValue as string,
			time: Timestamp.fromDate(new Date()),
            creationId: creationId
		};

        const docRef = await addDoc(collection(db, `creations/${creationId}/commits`), newCommit);
		const commitId = docRef.id;

		const storage = getStorage();

		if (selectedFiles) {
			for (let i = 0; i < selectedFiles.length; i++) {
				const file = selectedFiles[i];
				const storageRef = ref(storage, `${creationId}/${commitId}/` + file.name);

				try {
					const snapshot = await uploadBytes(storageRef, file);

					const downloadURL = await getDownloadURL(snapshot.ref);

					// Store the download URL in Firestore (or another database)
					await addDoc(collection(db, `commits/${commitId}/files`), {
						name: file.name,
						url: downloadURL,
						type: file.type
					});
				} catch (error) {
					console.error('Error uploading file:', error);
				}
			}
		}
	};

	let addEvidence = async () => {
        const fileInput = document.getElementById('fileInput')! as HTMLInputElement;
		fileInput.click();
	};
</script>

<svelte:head>
	<title>{creation.name}</title>
</svelte:head>

<div class="flex flex-row gap-10 items-baseline">
	<Title>{creation.name}</Title>
	<span class="text-tertiary"><Subtitle>{creation.type}</Subtitle></span>
</div>
{#if addingProcess}
	<form on:submit={addProcess} class="flex flex-col gap-5 mt-5">
		<div class="flex flex-row items-baseline text-secondary">
			<Subtitle>I am</Subtitle>
			<Slider />
			<Subtitle>complete</Subtitle>
		</div>
		<input type="file" id="fileInput" hidden multiple bind:files={selectedFiles} />
		<Info
			click={addEvidence}
			infoText="Upload drafts (screen recordings, screenshots, photos) of work completed since your last commit."
			buttonText="Upload Evidence"
		></Info>
		{#if selectedFiles}
			{#each selectedFiles as file}
				<div class="flex flex-row items-baseline">
					<span class="text-md text-tertiary">{file.name}</span>
				</div>
			{/each}
		{/if}

		<div>
			<Textfield
				placeholder="Enter a short description about progress since your last log."
				name="commitDescription"
				size="lg"
			/>
		</div>
		<div class="">
			<Button size="md">Commit</Button>
			<Button size="md" submit={false} click={toggleAddingProcess}>Cancel</Button>
		</div>
	</form>
{:else}
    <div class="mt-5">
        <Button click={toggleAddingProcess} size="lg">
            <i class="fas fa-plus text-xl mb-2"></i>
            Log Creative Process
        </Button>
    </div>

{/if}
<div class="mt-10 text-secondary">
	<Subtitle>Progress Timeline</Subtitle>
</div>
