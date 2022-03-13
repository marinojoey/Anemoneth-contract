import { ethers } from 'ethers';
import anemonethJSON from "../../utils/anemoneth.json"
const anemonethProxyAddress = "0x70649c7b44ab1177EF8c058379ba975d78735378";
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
