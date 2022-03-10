import React, { useContext } from "react";
import "./LoginRegister.scss";
// import { AuthContext } from "../../App";
// import PopUp from "../PopUp/PopUp";
import { ethers } from "ethers";
import contractCall from "../ContractCall/ContractCall";


const { ethereum } = window;
class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false
        };
    }

    toggleConn = () => {
        this.setState({
            connected: !this.state.seen
        })
    }

    connectWalletHandler = async () => {
        if (ethereum) {
            ethereum.request({method: 'eth_requestAccounts'})
            this.provider = new ethers.providers.Web3Provider(ethereum);
            this.signer = await this.provider.getSigner();
            this.addr = await this.signer.getAddress();
            this.addrBalance = ethers.utils.formatEther(await this.provider.getBalance(this.addr));
            this.toggleConn();
        } else {
            alert("Please install MetaMask to connect your wallet and try again");
        }
    }
    registerCall = async () => {
        let instance = contractCall();
        const username = document.querySelector('.usrnm').value;
        await instance.register(username, { value: ethers.utils.parseUnits('1', 'gwei'), gasLimit: 125000 });
    }
    render() {
        if(!this.state.connected) {
            return (
                <div id="LoginRegisterComponent">
                        <button className="loginButtons" onClick={this.connectWalletHandler}>Connect Wallet</button>
                </div>
            );
        }
        else if (this.state.connected) {
            return (
                <div id="LoginRegisterComponent">
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
            );
        }

    };
}

export default LoginRegister; 