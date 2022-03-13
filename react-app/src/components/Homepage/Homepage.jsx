import React, { useState, useRef } from 'react'
import './homepage.css';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'


function Homepage( { isUser, connected, addr1, addrblnc } ) {

  let status;
  (() => {
      if (connected) {
      status = "connected"
    } else status = "not connected"
  })();

let web3s = new Web3Storage({
  token: process.env.REACT_APP_WEB3STORAGE_TOKEN
});

async function storeFiles() {
  const string = document.querySelector('.str').value;
  const file = new File([string], addr1);
  const cid = await web3s.put([file]);
  console.log('stored files with cid:', cid)
  return cid
}

async function retrieveFiles(cid) {
  const res = await web3s.get(cid)
  console.log(`Got a response! [${res.status}] ${res.statusText}`)
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`)
  }
  const files = await res.files()
  const file = files[0]
  let fileText = await file.text();
  console.log(fileText)
}


  return (
      <div className='root'>
        <h1>HOMEPAGE</h1>
        <label htmlFor='str' className='strlbl'></label>
        <input type="text" className='str' placeholder='web3.storage'></input>
        <button className='stringbtn' onClick={ storeFiles }>Post</button>
        <br/>
        <input type="text" className='cid' placeholder='Content Identifier'></input>
        <button className='retrieve' onClick={ () => retrieveFiles(document.querySelector('.cid').value) }>Retrieve</button>
      </div>
  )
}

export default Homepage;
