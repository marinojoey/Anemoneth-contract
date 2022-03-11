import React, { useContext, useState, setState } from "react";
import "./Login.scss";
// import { AuthContext } from "../../App";
// import PopUp from "../PopUp/PopUp";
import { ethers } from "ethers";
import contractCall from "../ContractCall/ContractCall";
const { ethereum } = window;


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            // isUser: false
        };
    }
    toggleConn = () => {
        this.setState({
            connected: !this.state.seen
        })
    }
    // setUser = () => {
    //     // this.setState({
    //     //     isUser: true
    //     // })
    //     this.props.setUser(true)
    // }

    connectWalletHandler = async () => {
        if (ethereum) {
            ethereum.request({method: 'eth_requestAccounts'})
            this.provider = new ethers.providers.Web3Provider(ethereum);
            this.signer = await this.provider.getSigner();
            this.addr = await this.signer.getAddress();
            this.addrBalance = ethers.utils.formatEther(await this.provider.getBalance(this.addr));
            this.toggleConn();
            this.contractInstance = await contractCall();
            if (await this.contractInstance.isRegistered(this.addr)) {
                this.props.setUser(true)
                // console.log(this.state.isUser)
            }
        } else {
            alert("Please install MetaMask to connect your wallet and try again");
        }
    }
    registerCall = async () => {
        let contractInstance = await contractCall();
        const username = document.querySelector('.usrnm').value;
        await contractInstance.register(username, { value: 1000000000, gasLimit: 25000000 });
    }
    // isUserRegistered = async () => {
    //     let contractInstance = await contractCall();
    //     this.provider = new ethers.providers.Web3Provider(ethereum);
    //     this.signer = await this.provider.getSigner();
    //     this.addr = await this.signer.getAddress();
    //     if (await contractInstance.isRegistered(this.addr)) {
    //         this.setUser()
    //         console.log("test")
    //     }
    // }

    render() {
        if(!this.state.connected) {
            return (
                <div className='loginpage'>
                 <div className='loginPiecesContainer'>
                  <div id="title" className='loginPieces'>
                    <h1>Anemoneth</h1>
                    <h4>Connect with friends and the decentralised world around you on Anemoneth</h4>
                  </div>
                  <div className='loginPieces'>
                    <button className="loginButtons" onClick={this.connectWalletHandler}>Connect Wallet</button>
                  </div>
                </div>
              </div>
            );
        }
        else if (this.state.connected) {
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
                        <div className='addr'> <b>Your address:</b> {this.addr}</div>
                        <div className='blnc'>Your balance:{this.addrBalance}</div>
                    </div>
                    <div className='usrnmwrapper'>
                        <label htmlFor='usrnm' className='usrnmlbl'> Username: (cannot be changed) </label>
                        <input type="text" className='usrnm' placeholder='username'></input>
                        <button className='registerbtn' onClick={this.registerCall} >Register</button>
                        <div>Registration fee is 1 Gwei</div>
                    </div>
                  </div>
                </div>
              </div>
            );
        }

    };
}

export default Login; 
