import './App.scss';
import React , { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/LoginPage/Login';
import Homepage from './components/Homepage/Homepage';
import Login from './components/Login/Login'

export const AuthContext = createContext();

function App() {
  const [isUser, setUser] = useState(false);
  const [connected, setConn] = useState(false);
  const [addr1, setAddr1] = useState(0);
  const [addrblnc, setblnc] = useState(0);

  // const setUserData = () => {
  //   setUser(true)
  //   setConn(true)
  //   setAddr1(addr)
  //   setblnc(addrBalance)
  // }

  return (
    <AuthContext.Provider value={isUser}>
      <Router>
        <Routes>
          <Route path="/" 
            element = { (isUser) ? 
              <Homepage isUser={isUser} connected={connected} addr1={addr1} addrblnc={addrblnc} /> : 
              <Login setUser={setUser} setConn={setConn} setAddr1={setAddr1} setblnc={setblnc}/>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
