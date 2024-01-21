<script lang="ts">
	import type { Commit } from '$lib';
	import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
	import { fade } from 'svelte/transition';
	export let commit: Commit;
	import { db } from '$lib';
	import Textfield from './Textfield.svelte';

	let editing = false;

	function extractType(filename: string) {
		const parts = decodeURIComponent(filename).split('+');
		return parts[0];
	}

	let toggleEditing = () => {
		editing = !editing;
	};

	let deleteCommit = async () => {
		await deleteDoc(doc(db,`creations/${commit.creationId}/commits`, commit.id!));
	};

	let submitEdit = async () => {
		
		const textfield = document.getElementById('description') as HTMLInputElement;
		commit.description = textfield.value;

		editing = false;

		await updateDoc(doc(db, `creations/${commit.creationId}/commits`, commit.id!), {
			description: commit.description
		});
	};
</script>

<div
	class="flex flex-col gap-2 mt-5 w-7/12 rounded-2xl bg-opacity-80 bg-primary p-5"
	in:fade={{ duration: 300 }}
>
	<div class="flex flex-row gap-5 align-middle">
		<div class="text-xl text-secondary">
			{commit.percentage}%
		</div>
		{#if editing}
			<Textfield placeholder="Description" id="description" text={commit.description} />
			<i
			class="fas fa-check text-lg text-white hover:text-secondary cursor-pointer"
			on:click={submitEdit}
		></i>
		{:else}
			<div class="text-lg text-white">
				{commit.description}
			</div>
			<i
			class="fas fa-pencil text-lg text-white hover:text-secondary cursor-pointer"
			on:click={toggleEditing}
		></i>
		{/if}


		<i
			class="fas fa-trash text-lg text-white hover:text-secondary cursor-pointer"
			on:click={deleteCommit}
		></i>
	</div>
	<div class="bg-tertiary p-5 rounded-md">
		<ul class="flex flex-row flex-wrap flex-grow justify-start gap-2">
			{#each Object.entries(commit.evidence) as [filename, url]}
				<li class="flex-item flex-grow">
					{#if filename.startsWith('image')}
						<img class="h-24 object-contain rounded-md" src={url} alt={filename} />
					{:else if filename.startsWith('audio')}
						<audio controls class="h-24">
							<source src={url} type={extractType(filename)} />
							Your browser does not support the audio tag.
						</audio>
					{:else if filename.startsWith('video')}
						<video controls class="h-24">
							<track kind="captions" />
							<source src={url} type={extractType(filename)} />
							Your browser does not support the video tag.
						</video>
					{:else}
						<a href={url} download={filename} class="text-white">Download {extractType(filename)}</a
						>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>
