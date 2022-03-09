import React, { useState } from 'react'
import './login.scss';
import LoginRegisterComponent from '../LoginRegisterComponent/LoginRegister'

function Login() {


  return (
    <div className='loginpage'>
      <div className='loginPiecesContainer'>
        <div id="title" className='loginPieces'>
          <h1>Anemoneth</h1>
          <h4>Connect with friends and the decentralised world around you on Anemoneth</h4>
        </div>
        <div className='loginPieces'>
          <LoginRegisterComponent/>
        </div>
      </div>
    </div>
  )
}

export default Login