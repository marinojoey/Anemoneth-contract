import './App.scss';
import React , { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/LoginPage/Login';
import Homepage from './components/Homepage/Homepage';
import Login from './components/Login/Login'
import Navbar from './components/Navbar/Navbar';

export const AuthContext = createContext();

function App() {
  const [isUser, setUser] = useState(false);
  const [connected, setConn] = useState(false);
  const [addr1, setAddr1] = useState(0);
  const [dispAddr, setDispAddr] = useState("")
  const [addrblnc, setblnc] = useState(0);
  const [clwnblnc, setclwnblnc] = useState(0)
  const [username, setUsername] = useState("")

  // console.log(username)

  return (
    <>
    <Navbar isUser={isUser} connected={connected} addr1={addr1} addrblnc={addrblnc} clwnblnc={clwnblnc} dispAddr={dispAddr} username={username} />
    <AuthContext.Provider value={isUser}>
      <Router>
        <Routes>
          <Route path="/" 
            element = { (isUser) ? 
              <Homepage isUser={isUser} connected={connected} addr1={addr1} addrblnc={addrblnc} /> : 
              <Login setUser={setUser} setConn={setConn} setAddr1={setAddr1} setblnc={setblnc} setclwnblnc={setclwnblnc} setDispAddr={setDispAddr} setUsername={setUsername} connected={connected} />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
    </>
  );
}

export default App;
