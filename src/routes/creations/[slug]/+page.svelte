<script lang="ts">
	import {
		Title,
		Button,
		Subtitle,
		Textfield,
		Slider,
		Info,
		db,
		commitsListener,
		commits
	} from '$lib';
	import type { Commit, Creation } from '$lib';
	import { CommitDiv } from '$lib';

	export let data;
	let user = data.user;
	let creation: Creation = data.creation;

	import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import {
		Timestamp,
		addDoc,
		arrayUnion,
		collection,
		doc,
		onSnapshot,
		orderBy,
		query,
		setDoc,
		updateDoc
	} from 'firebase/firestore';
	import { onMount } from 'svelte';

	import ShowcaseDiv from '$lib/components/ShowcaseDiv.svelte';
	import type { Product } from '$lib';

	let selectedFiles: FileList;
	let addingProcess = false;
	let loading = false;

	let addTagName: string = '';

	let sliderValue = creation.percentage;

	let toggleAddingProcess = () => {
		addingProcess = !addingProcess;
	};

	let addTag = async () => {
		if (addTagName == '') {
			return;
		}
		const creationRef = doc(db, 'creations', creation.id!);
		creation.tags = [...creation.tags, addTagName];
		await updateDoc(creationRef, { tags: arrayUnion(addTagName) });
		addTagName = '';
	};

	function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as ArrayBuffer);
			reader.onerror = (error) => reject(error);
			reader.readAsArrayBuffer(file);
		});
	}

	async function hashFile(file: File): Promise<string> {
		try {
			const arrayBuffer: ArrayBuffer = await readFileAsArrayBuffer(file);
			const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
			return bufferToHex(hashBuffer);
		} catch (error) {
			console.error('Error hashing file:', error);
			return 'hash failed';
		}
	}

	function bufferToHex(buffer: ArrayBuffer) {
		return Array.from(new Uint8Array(buffer))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	function arrayBufferToBase64(buffer: ArrayBuffer) {
		let binary = '';
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}

	let addCommit = async (event: SubmitEvent) => {
		loading = true;
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		const commitDescription = formData.get('commitDescription');

		let evidence: { [key: string]: string } = {};

		const storage = getStorage();

		let hashes: string[] = [];
		let tags: { [key: string]: number } = {};

		if (selectedFiles) {
			for (let i = 0; i < selectedFiles.length; i++) {
				const file = selectedFiles[i];
				const tag = formData.get(file.name) as string;

				if (Object.keys(tags).includes(tag)) {
					console.log('double tag used');
					//TODO error here
				} else {
					const simScore = await getSim(file, tag);
					if (simScore) {(tags[tag] = simScore as number);};
				}

				const fileName = encodeURIComponent(tag + '+' + file.type + '+' + String(Date.now()));
				const storageRef = ref(storage, `${creation.id!}/${fileName}`);
				const snapshot = await uploadBytes(storageRef, file);
				const downloadURL = await getDownloadURL(snapshot.ref);

				hashes.push(await hashFile(file));
				evidence[fileName] = downloadURL;
			}
		}

		const fileInput = document.getElementById('fileInput')! as HTMLInputElement;
		if (fileInput.value) {
			fileInput.value = '';
		}

		const newCommit: Commit = {
			description: commitDescription as string,
			uid: user.uid,
			percentage: Number(sliderValue),
			time: Timestamp.fromDate(new Date()),
			creationId: creation.id!,
			evidence: evidence,
			hashes: hashes,
			blockchained: false,
			tags: tags
		};

		await addDoc(collection(db, `creations/${creation.id!}/commits`), newCommit);
		toggleAddingProcess();
		loading = false;

		await updatePercentage();

		if (creation.isFinished) {
			const docRef = doc(db, 'creations', creation.id!);
			await updateDoc(docRef, { isFinished: true });
			await updatePercentage();

			const product: Product = {
				name: creation.name,
				type: creation.type,
				description: creation.description,
				creator: creation.username,
				started: creation.started,
				ended: Timestamp.fromDate(new Date()),
				likes: 0
			};

			await setDoc(doc(db, 'marketplace', creation.id!), product);
		}
	};

	let updatePercentage = async () => {
		creation.percentage = sliderValue;
		//update the percentage on creation
		await updateDoc(doc(db, 'creations', creation.id!), {
			percentage: creation.percentage
		});
	};

	let addEvidence = async () => {
		const fileInput = document.getElementById('fileInput')! as HTMLInputElement;
		fileInput.click();
	};

	async function updateLastV() {
		const docRef = doc(db, 'creations', creation.id!);
		await updateDoc(docRef, { lastVisited: Timestamp.fromDate(new Date()) });
	}

	let finishCreation = async () => {
		if (creation.percentage < 100) {
			toggleAddingProcess();
			creation.percentage = 100;
			sliderValue = 100;
		}
		creation.isFinished = true;
	};

	let getSim = async (file: File, tag: string) => {
		if (tag != '') {
			//get image with same tag in previous commit (top commit)
			const key: string | undefined =
				$commits.length == 0
					? undefined
					: Object.keys($commits[0].evidence).find((key) => key.startsWith(tag));

			if (key) {
				const url = $commits[0].evidence[key];
				const base64Image = arrayBufferToBase64(await file.arrayBuffer());

				const res = await fetch('../api/imageSimilarity', {
					method: 'POST',
					body: JSON.stringify({ url: url, imageb64: base64Image })
				});

				const data = await res.json();
				console.log('image sim res: ', data.sim);
				return data.sim;
			}
		}

		return null;
	};

	onMount(() => {
		const commitsInstance = onSnapshot(
			query(collection(db, `creations/${creation.id}/commits`), orderBy('time', 'asc')),
			(snapshot) => {
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
			}
		);

		//done here instead of on page load so non-blocking (non essential update anyway)
		updateLastV();

		return () => {
			commitsInstance(); // Cleanup listener when the component is destroyed
			commits.set([]);
		};
	});
</script>

<svelte:head>
	<title>{creation.name}</title>
</svelte:head>

<div class="flex flex-row gap-10 items-baseline">
	<Title>{creation.name}</Title>
	<span class="text-tertiary"><Subtitle>{creation.type}</Subtitle></span>
</div>
{#if addingProcess}
	<form on:submit={addCommit} class="flex flex-col gap-5 mt-5">
		<div class="flex flex-row items-baseline text-secondary">
			<Subtitle>I am</Subtitle>
			<Slider min={creation.percentage} bind:sliderValue />
			<Subtitle>complete</Subtitle>
		</div>
		<input type="file" id="fileInput" name="fileInput" hidden multiple bind:files={selectedFiles} />
		<div class="flex flex-row items-center gap-2">
			<Button click={addEvidence} submit={false}>Upload Evidence</Button>
			<Info
				infoText="Upload drafts (screen recordings, screenshots, photos) of work completed since your last commit."
			></Info>
		</div>
		<div class="flex flex-row items-center gap-2">
			<Textfield size="sm" placeholder="Tag name" bind:text={addTagName}></Textfield>
			<Button click={addTag} submit={false} size="sm" icon="fa-tag">Add</Button>
		</div>
		{#if selectedFiles}
			{#each selectedFiles as file}
				<div class="flex flex-row items-center">
					<span class="text-md text-primary">{file.name}</span>
					<select
						name={`${file.name}`}
						class="ml-1 w-20 h-6 border-secondary border-2 text-primary text-sm font-bold focus:outline-none rounded-xl"
					>
						<option value="">No tag</option>
						{#each creation.tags as tag}
							<option value={tag}>{tag}</option>
						{/each}
					</select>
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
		<div class="flex flex-row gap-2">
			<Button size="md" icon={loading ? 'fa-spinner animate-spin' : 'fa-upload'}>Commit</Button>
			<Button size="md" submit={false} click={toggleAddingProcess} icon="fa-cancel">Cancel</Button>
		</div>
	</form>
{:else if creation.isFinished}
	<div class="mt-5 text-secondary">
		<Subtitle>This creation is finished</Subtitle>
	</div>
{:else}
	<div class="flex-col flex gap-5 mt-5">
		<Button click={toggleAddingProcess} size="lg" icon="fa-plus">Log Creative Process</Button>
		<Button click={finishCreation} size="lg" icon="fa-check">Finish Creation</Button>
	</div>
{/if}
<div class="mt-10 text-secondary">
	<Subtitle>Progress Timeline</Subtitle>
	<div class="h-5"></div>
	{#each $commits as commit, index (commit.id)}
		{#if index === $commits.length - 1}
			<CommitDiv {user} {commit} last={true}></CommitDiv>
		{:else}
			<CommitDiv {user} {commit}></CommitDiv>
		{/if}
	{/each}
</div>
