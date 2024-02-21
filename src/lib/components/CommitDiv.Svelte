<script lang="ts">
	import type { Commit, User } from '$lib';
	import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
	import { fade } from 'svelte/transition';
	export let commit: Commit;
	export let user: User;
	export let first = false;

	import { db } from '$lib';
	import Textfield from './Textfield.svelte';

	let editing = false;
	let metamask = false;

	function extractType(filename: string) {
		const parts = decodeURIComponent(filename).split('+');
		return parts[1];
	}

	function extractTag(filename: string) {
		const parts = decodeURIComponent(filename).split('+');
		return parts[0];
	}

	let toggleEditing = () => {
		editing = !editing;
	};

	let deleteCommit = async () => {
		await deleteDoc(doc(db, `creations/${commit.creationId}/commits`, commit.id!));
	};

	let submitEdit = async () => {
		const textfield = document.getElementById('description') as HTMLInputElement;
		commit.description = textfield.value;

		editing = false;

		await updateDoc(doc(db, `creations/${commit.creationId}/commits`, commit.id!), {
			description: commit.description
		});
	};

	import Web3 from 'web3';
	import { onMount } from 'svelte';
	import Info from './Info.svelte';

	async function commitToBlock() {
		console.log('commiting');
		//stored on server for security
		const deets = await fetch('../api/blockchainCommit', { method: 'GET' });
		const { abi, contractAddr } = await deets.json();

		// @ts-ignore
		if (metamask) {
			console.log('metamask installed');
			// @ts-ignore
			const web3 = new Web3(window.ethereum);
			const contract = new web3.eth.Contract(JSON.parse(abi), contractAddr);
			try {
				// Request account access
				// @ts-ignore
				await window.ethereum.send('eth_requestAccounts');

				const accounts = await web3.eth.getAccounts();
				const fromAddress = accounts[0]; // User's address

				// Create a transaction object
				const txObject = {
					to: contractAddr,
					data: contract.methods.makeCommit(commit.hashes).encodeABI(),
					//gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
					nonce: await web3.eth.getTransactionCount(fromAddress),
					from: fromAddress,
					gasLimit: '0',
					maxFeePerGas: '0',
					maxPriorityFeePerGas: '0'
				};
				console.log('hashes: ', commit.hashes);

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
				console.log(
					'maxFeePerGas: ',
					maxFeePerGas,
					'maxPriorityFeePerGas: ',
					maxPriorityFeePerGas,
					'baseFee: ',
					baseFee,
					'gasLimit: ',
					txObject.gasLimit
				);

				// MetaMask will handle signing and sending the transaction
				commit.blockchained = true;
				await updateDoc(doc(db, `creations/${commit.creationId}/commits`, commit.id!), {
					blockchained: commit.blockchained
				});

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

	onMount(() => {
		// @ts-ignore
		if (typeof window.ethereum !== 'undefined') {
			metamask = true;
		}
	});
</script>

{#if !first}
	<div class="w-10 h-10 bg-primary bg-opacity-80 ml-10"></div>
{:else}
	<div class="mt-5"></div>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<div class="flex flex-col gap-2 w-6/12 rounded-2xl bg-opacity-80 bg-primary p-5">
	<div class="flex flex-row gap-5 align-middle">
		<div class="text-xl text-secondary">
			{commit.percentage}%
		</div>
		{#if commit.uid == user.uid}
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
					class="fas fa-pencil text-lg text-primary text-opacity-80 hover:text-secondary cursor-pointer"
					on:click={toggleEditing}
				></i>
			{/if}

			<i
				class="fas fa-trash text-lg text-primary text-opacity-80 hover:text-secondary cursor-pointer"
				on:click={deleteCommit}
			></i>

			{#if commit.blockchained}
				<i class="fas fa-link text-lg text-secondary text-opacity-80"></i>
			{:else if !metamask}
				<Info infoText="Add the Metamask chrome extension to push your commits to the blockchain"
				></Info>
			{:else}
				<i
					class="fas fa-link text-lg text-primary text-opacity-80 hover:text-secondary cursor-pointer"
					on:click={commitToBlock}
				></i>
			{/if}
		{/if}
	</div>
	<div class="bg-tertiary p-5 rounded-md">
		<ul class="flex flex-row flex-wrap flex-grow justify-start">
			{#each Object.entries(commit.evidence) as [filename, url]}
				<li class="flex-item flex-grow">
					{#if extractTag(filename) != ''}
					<i class="fas fa-tag text-primary text-sm">{extractTag(filename)}</i>
					{/if}
					{#if extractType(filename).startsWith('image')}
						<img class="h-24 object-contain rounded-md" src={url} alt={filename} />
					{:else if extractType(filename).startsWith('audio')}
						<audio controls class="h-24">
							<source src={url} type={extractType(filename)} />
							Your browser does not support the audio tag.
						</audio>
					{:else if extractType(filename).startsWith('video')}
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
