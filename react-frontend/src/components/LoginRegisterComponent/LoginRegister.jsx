import React, { useContext } from "react";
import "./LoginRegister.scss";
import { AuthContext } from "../../App";

function LoginRegister() {
    const authContext = useContext(AuthContext);
    function connectWalletHandler() {
        // check if user has metamask installed
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
                .then(async result => {
                    await authContext.setUserAddress(result[0]);
                    if (authContext.userAddress) await authContext.setAuthenticated(true);
                    localStorage.setItem("metaMaskAddress", authContext.userAddress);
                    localStorage.setItem("isAuthenticated", authContext.authenticated);
                })
        } else {
            alert("Please install MetaMask to connect your wallet and try again");
        }
    }

    return (
        <div id="LoginRegisterComponent">
                <button className="loginButtons" onClick={() => connectWalletHandler()}>Connect Wallet</button>
        </div>
    )
}

export default LoginRegister; 