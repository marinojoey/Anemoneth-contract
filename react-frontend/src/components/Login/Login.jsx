import React, { useState } from "react";
import "./Login.scss";
// import { AuthContext } from "../../App";
// import PopUp from "../PopUp/PopUp";
import { ethers } from "ethers";
import contractCall from "../ContractCall/ContractCall";
const { ethereum } = window;


function Login({ setUser, setConn, setAddr1, setblnc, setclwnblnc, setDispAddr, setUsername, connected }) {
    let displayAddr;
    let addrBalance;
    let username;
    let provider;
    let signer;
    let addr;


    async function getCLWNBlnc() {
        let contractInstance = await contractCall();
        let balanceOf = parseInt(await contractInstance.balanceOf(addr), 16);
        setclwnblnc(balanceOf);
    }
    function presentAddr(numAddr) {
        const strAddr = numAddr.toString();
        const first = strAddr.slice(0,4);
        const last = strAddr.slice(-4);
        displayAddr = `${first}...${last}`;
    }
    async function getUsername() {
        let contractInstance = await contractCall();
        username = await contractInstance.getUserName(addr)
        console.log(username)
    }

    async function connectWalletHandler() {
        if (ethereum) {
            ethereum.request({method: 'eth_requestAccounts'})
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = await provider.getSigner();
            addr = await signer.getAddress();
            addrBalance = ethers.utils.formatEther(await provider.getBalance(addr));
            getUsername(addr);
            setUsername(username);
            presentAddr(addr);
            setDispAddr(displayAddr)
            setAddr1(addr);
            setblnc(addrBalance);
            setConn(true);
            let contractInstance = await contractCall();
            if (await contractInstance.isRegistered(addr)) {
                setUser(true)
            }
            getCLWNBlnc();
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
                        <button id="cnctbtn" className="loginButtons" onClick={connectWalletHandler}>Connect Wallet</button>
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
                        <br></br>
                        <div>Now you get to register!</div>
                        <br></br>
                        <div>It will cost 1 Gwei and you will recieve 1 CLWN in return.</div>
                        <br></br>
                        <div className='usrnmwrapper'>
                            <label htmlFor='usrnm' className='usrnmlbl'> Username: </label>
                            <input type="text" className='usrnm' placeholder='Satoshi?'></input>
                            {/* <br></br><br></br> */}
                            <button id="regbtn" className='loginButtons' onClick={registerCall} >Register</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Login; 
