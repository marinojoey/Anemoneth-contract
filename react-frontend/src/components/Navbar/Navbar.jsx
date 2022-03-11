import './navbar.scss'
import React from 'react'


function Navbar( { clwnblnc, dispAddr, username } ) {

  return (
    <div className='navbar ' id="navbar">
        <div className='wrapper'>
            <div className="left">
                <img src="assets/logo.png" alt="logo" className='logo'></img>
            </div>
            <div className='center'>
                Anemoneth
            </div>
            <div className="right">
                <div className='addrEl'>
                    Address: {dispAddr}
                </div>
                <div className='clwnEl'>
                    CLWN balance: {clwnblnc}
                </div>
                <div className='regEl'>
                    Registered: {username}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar