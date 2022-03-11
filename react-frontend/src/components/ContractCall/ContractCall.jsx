import { ethers } from 'ethers';
import anemonethJSON from "../../utils/anemoneth.json"
const anemonethProxyAddress = "0x35E49d902301A1e9D081aFa6b404101cD37F6c8d";
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
