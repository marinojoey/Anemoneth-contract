import React, { useState, useRef } from 'react'
import './homepage.scss';
import { Web3Storage, File } from 'web3.storage'

let web3s = new Web3Storage({
  token: process.env.REACT_APP_WEB3STORAGE_TOKEN
});

let fileName = 'plain-utf8.txt'
async function storeFiles() {
  const string = document.querySelector('.str').value;
  const file = new File([string], fileName);
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

function Homepage() {
  return (
      <>    
        <h1>HOMEPAGE</h1>
        <label htmlFor='str' className='strlbl'></label>
        <input type="text" className='str' placeholder='web3.storage'></input>
        <button className='stringbtn' onClick={ storeFiles }>Post</button>
        <br/>
        <input type="text" className='cid' placeholder='Content Identifier'></input>
        <button className='retrieve' onClick={ () => retrieveFiles(document.querySelector('.cid').value) }>Retrieve</button>
        <div className='respone'></div>
      </>
  )
}

export default Homepage; 