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
            <div>
                <form>
                    <input className="loginInputs" type="text" id="login" name="login" placeholder="Email or Username"></input>
                    <br />
                    <input className="loginInputs" type="password" id="password" name="password" placeholder="Password"></input>
                    <br />
                    <input className="loginButtons" type="submit" id="loginSubmit" name="loginSubmit" value="Log In" />
                </form>
                <button className="loginButtons" onClick={() => connectWalletHandler()}>Log In with MetaMask</button>
                <br />
                {/* <a href="">Forgot Password</a> */}
            </div>
            <div>
                <button className="loginButtons">Create new account</button>
            </div>
        </div>
    )
}

export default LoginRegister;
