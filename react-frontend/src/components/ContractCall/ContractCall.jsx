import { ethers } from 'ethers';
import anemonethJSON from "../../utils/anemoneth.json"
const anemonethProxyAddress = "0x25a0C89a55dfF4b779bde0DDa7897F6Ef06e6565";
const { ethereum } = window;
let provider;
let signer;
let contractInstance;

function contractCall() {

    ethereum.request({ method: 'eth_requestAccounts'});
    provider = new ethers.providers.Web3Provider(ethereum);
    signer = provider.getSigner();
    contractInstance = new ethers.Contract(anemonethProxyAddress, anemonethJSON.abi, signer);
    return contractInstance; 
}

export default contractCall;
