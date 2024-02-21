// gasEstimates.js
import Web3 from 'web3';
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY');

export async function getGasPrice() {
    const estimatedGasPrice = await web3.eth.getGasPrice();
    return estimatedGasPrice;
}
