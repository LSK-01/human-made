import { json } from '@sveltejs/kit';
import fs from 'fs';
import Web3 from 'web3';

const blockchainPath = "/Users/god/Documents/thirdYear/cs310/humanmade/blockchain"
const abi = await fs.promises.readFile(`${blockchainPath}/ABI.json`, 'utf8');
const contractAddr = await fs.promises.readFile(`${blockchainPath}/contractAddress.txt`, 'utf8');
const ethNode = "HTTP://127.0.0.1:7545";
//await fs.promises.readFile(`${blockchainPath}/ethNode.txt`, 'utf8');

const web3 = new Web3(ethNode);

const contract = new web3.eth.Contract(JSON.parse(abi), contractAddr);

// Function to make a commit
async function makeCommit(commitHash: string, fromAddress: string) {
	const receipt = await contract.methods.makeCommit(commitHash).send({ from: fromAddress });
	return receipt.transactionHash;
}

export const POST = async ({ request }) => {
	const data = await request.json();
	const walletAddr = data;

	const resp = await makeCommit('69', walletAddr);
	console.log('resp fom makeCommit: ' + resp);

	return json(resp);
};
