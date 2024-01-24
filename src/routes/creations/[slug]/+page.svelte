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

	import fs from 'fs';
	import Web3 from 'web3';

	async function commit() {
		console.log('commiting');
		const deets = await fetch('../api/blockchainCommit', { method: 'GET' });
		const { abi, contractAddr, ethNode } = await deets.json();

		if (typeof window.ethereum !== 'undefined') {
			console.log('metamask installed');
			const web3 = new Web3(window.ethereum);
			const contract = new web3.eth.Contract(JSON.parse(abi), contractAddr);
			try {
				// Request account access
				await window.ethereum.enable();

				const accounts = await web3.eth.getAccounts();
				const fromAddress = accounts[0]; // User's address

				// Create a transaction object
				const txObject = {
					to: contractAddr,
					data: contract.methods.makeCommit('commitHash').encodeABI(),
					//gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
					nonce: await web3.eth.getTransactionCount(fromAddress),
					from: fromAddress,
					gasLimit: '0',
					maxFeePerGas: '0',
					maxPriorityFeePerGas: '0'
				};
				console.log('gas estimating:', txObject);

				// Get current base fee and calculate appropriate maxFeePerGas
				const latestBlock = await web3.eth.getBlock('latest');
				const baseFee = latestBlock.baseFeePerGas;
				const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei'); // Example priority fee
				const maxFeePerGas = web3.utils.toHex(Number(baseFee) + Number(maxPriorityFeePerGas));

				txObject.maxFeePerGas = maxFeePerGas;
				txObject.maxPriorityFeePerGas = maxPriorityFeePerGas;

				// Now estimate gas limit
				const estimatedGas = await web3.eth.estimateGas(txObject);
				const buffer = 1.2;
				txObject.gasLimit = web3.utils.toHex(Math.ceil(buffer * Number(estimatedGas)));
				// MetaMask will handle signing and sending the transaction
				const txHash = await web3.eth.sendTransaction(txObject);
				console.log('Transaction Hash:', txHash);
				return txHash;
			} catch (error) {
				console.error('Error:', error);
			}
		} else {
			console.log('MetaMask is not installed');
		}
	}

	let firstCommit: Commit;

	let selectedFiles: FileList;
	let addingProcess = false;
	let loading = false;

	let toggleAddingProcess = () => {
		addingProcess = !addingProcess;
	};

	let addCommit = async (event: SubmitEvent) => {
		loading = true;
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		const commitDescription = formData.get('commitDescription');
		const sliderValue = document.getElementById('sliderValue')?.innerText;

		let evidence: { [key: string]: string } = {};

		const storage = getStorage();

		if (selectedFiles) {
			for (let i = 0; i < selectedFiles.length; i++) {
				const file = selectedFiles[i];
				//now we can do like "startsWith(image/)" etc.
				const fileName = encodeURIComponent(file.type + '+' + String(Date.now()));
				const storageRef = ref(storage, `${creation.id!}/${fileName}`);
				const snapshot = await uploadBytes(storageRef, file);
				const downloadURL = await getDownloadURL(snapshot.ref);

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
			evidence: evidence
		};

		await addDoc(collection(db, `creations/${creation.id!}/commits`), newCommit);
		toggleAddingProcess();
		loading = false;

		creation.percentage = Number(sliderValue);
		//update the percentage on creation
		await updateDoc(doc(db, 'creations', creation.id!), {
			percentage: creation.percentage
		});

		console.log('commit res: ', await commit());
	};

	let addEvidence = async () => {
		const fileInput = document.getElementById('fileInput')! as HTMLInputElement;
		fileInput.click();
	};

	async function updateLastV() {
		const docRef = doc(db, 'creations', creation.id!);
		await updateDoc(docRef, { lastVisited: Timestamp.fromDate(new Date()) });
	}

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

		console.log('firstcunt; ', firstCommit);
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
			<Slider min={creation.percentage} />
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
			<Button size="md">
				{#if loading}
					<i class="fas fa-spinner mr-2 animate-spin"></i>
				{/if}
				Commit
			</Button>
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
	{#each $commits as commit, index (commit.id)}
		{#if index === 0}
			<CommitDiv {commit} first={true}></CommitDiv>
		{:else}
			<CommitDiv {commit}></CommitDiv>
		{/if}
	{/each}
</div>
