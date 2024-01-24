import { json } from '@sveltejs/kit';
import fs from 'fs';
import Web3 from 'web3';

/* const blockchainPath = "/Users/god/Documents/thirdYear/cs310/humanmade/blockchain"
const abi = await fs.promises.readFile(`${blockchainPath}/ABI.json`, 'utf8');
const contractAddr = await fs.promises.readFile(`${blockchainPath}/contractAddress.txt`, 'utf8');
const ethNode = await fs.promises.readFile(`${blockchainPath}/ethNode.txt`, 'utf8');//"HTTP://127.0.0.1:7545";

/* const web3 = new Web3(ethNode);
const contract = new web3.eth.Contract(JSON.parse(abi), contractAddr); */

/* // Function to make a commit
async function makeCommit(commitHash: string, fromAddress: string) {
	const receipt = await contract.methods.makeCommit(commitHash).send({ from: fromAddress });
	return receipt.transactionHash;
}
 
// Check if MetaMask is available
async function commit(){
    if (typeof window.ethereum !== 'undefined') {
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
                gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
                nonce: await web3.eth.getTransactionCount(fromAddress),
                from: fromAddress,
                gasLimit: '0'
            };
    
            const gasEstimate = web3.utils.toHex(await web3.eth.estimateGas(txObject));
            const gasBuffer = 1.2;
            txObject.gasLimit = web3.utils.toHex(Number(gasEstimate) * gasBuffer);
    
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


export const POST = async ({ request }) => {
	

	return json(await commit());
};
 */

export const GET = async () => {
	const blockchainPath = '/Users/god/Documents/thirdYear/cs310/humanmade/blockchain';
	const abi = await fs.promises.readFile(`${blockchainPath}/ABI.json`, 'utf8');
	const contractAddr = await fs.promises.readFile(`${blockchainPath}/contractAddress.txt`, 'utf8');
	const ethNode = await fs.promises.readFile(`${blockchainPath}/ethNode.txt`, 'utf8'); //"HTTP://127.0.0.1:7545";

    const info = {
        abi: abi,
        contractAddr: contractAddr,
        ethNode: ethNode
    }
    return json(info);
};
