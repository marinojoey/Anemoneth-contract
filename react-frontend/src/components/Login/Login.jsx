import React, { useState } from "react";
import "./Login.scss";
// import { AuthContext } from "../../App";
// import PopUp from "../PopUp/PopUp";
import { ethers } from "ethers";
import contractCall from "../ContractCall/ContractCall";
const { ethereum } = window;


function Login({ setUser, setConn, setAddr1, setblnc }) {
    // const [connected, setConn] = useState(false);
    // const [addr1, setAddr1] = useState(0);
    // const [addrblnc, setblnc] = useState(0);

    let addrBalance;
    let provider;
    let signer;
    let addr;
    

    async function connectWalletHandler() {
        if (ethereum) {
            ethereum.request({method: 'eth_requestAccounts'})
            provider = new ethers.providers.Web3Provider(ethereum);

            signer = await provider.getSigner();
            addr = await signer.getAddress();
            addrBalance = ethers.utils.formatEther(await provider.getBalance(addr));
            setAddr1(addr);
            setblnc(addrBalance);
            setConn(true);
            let contractInstance = await contractCall();
            
            if (await contractInstance.isRegistered(addr)) {
                setUser(true)
            }
        } 
        else {
            alert("Please install MetaMask to connect your wallet and try again");
        }
    }

    async function registerCall() {
        let contractInstance = await contractCall();
        const username = document.querySelector('.usrnm').value;
        await contractInstance.register(username, { value: 1000000000, gasLimit: 25000000 });
    }

    if(!connected) {
        return (
            <div className='loginpage'>
                <div className='loginPiecesContainer'>
                    <div id="title" className='loginPieces'>
                        <h1>Anemoneth</h1>
                        <h4>Connect with friends and the decentralised world around you on Anemoneth</h4>
                    </div>
                        <div className='loginPieces'>
                        <button className="loginButtons" onClick={connectWalletHandler}>Connect Wallet</button>
                    </div>
                </div>
            </div>
        );
    }
    else if (connected) {
        return (
            <div className='loginpage'>
                <div className='loginPiecesContainer'>
                    <div id="title" className='loginPieces'>
                        <h1>Anemoneth</h1>
                        <h4>Connect with friends and the decentralised world around you on Anemoneth</h4>
                    </div>
                    <div className='loginPieces'>
                        <div>Wallet Connected!</div>
                        <div className='userinfo'>
                            <div className='addr'> {"Your address:" + addr1}</div>
                            <div className='blnc'>{"Your balance: " + addrblnc}</div>
                        </div>
                        <div className='usrnmwrapper'>
                            <label htmlFor='usrnm' className='usrnmlbl'> Username: (cannot be changed) </label>
                            <input type="text" className='usrnm' placeholder='username'></input>
                            <button className='registerbtn' onClick={registerCall} >Register</button>
                            <div>Registration fee is 1 Gwei</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Login; 
