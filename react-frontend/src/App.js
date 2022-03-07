import './App.css';
import { ethers } from 'ethers';
import React from 'react';
import anemonethJSON from './utils/anemoneth.json'

const anemonethProxyAddress = "0x25a0C89a55dfF4b779bde0DDa7897F6Ef06e6565";
const anemonethAddress = "0x4a391779abcc217c3beab96a639934116069b830";

function App() {

  const [address, setAddress] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  // const [nemBalance, setNemBalance] = React.useState(0);

  const { ethereum } = window;
  let provider;

  if(ethereum) {
    ethereum.request({ method: 'eth_requestAccounts'});
    provider = new ethers.providers.Web3Provider(ethereum);
    getUserDetails();
  } else {
    console.log("Metamask not found. Pleast install MetaMask!")
  }

  async function getUserDetails() {
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    const userBalance = await provider.getBalance(addr);
    setAddress(addr);
    setBalance(ethers.utils.formatEther(userBalance));
  }

  async function callRegister() {
    let regAmt = document.querySelector('.regAmt').value;
    const username = document.querySelector('.usrnm').value;
    console.log(`register amount is: ${regAmt}. Username is: ${username}`);
    console.log(typeof(regAmt))
    console.log(typeof(username))
    if (regAmt >= .000000001 ) {
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(anemonethAddress, anemonethJSON.abi, signer);

      const overrides = {
        value: regAmt,
        gasLimit: 230000 
      };

      await contractInstance.register(username, overrides);
    } else console.log("Increase msg.value")
  }
  

  return (
    <div className="App">
      <div className='title'>
        Anemoneth
      </div>
      <div className='userinfo'>
        <p>
          <b>Your address:</b> {address}
        </p>
        <p>
          <b>Your balance:</b> {balance}
        </p>
      </div>
      <div className='contractcalls'>
        <p>Must send .000000001 or more ether (1000000000 wei) to be able to register </p>
        <p></p>
        <label htmlFor='regAmt'>Amount in wei:   </label>
        <input type="number" className='regAmt' placeholder='Amount'></input>
        <br></br>
        <label htmlFor='usrnm'> Username: (cannot be changed) </label>
        <input type="text" className='usrnm' placeholder='username'></input>
        <br></br>
        <button className='register' onClick={callRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default App;
