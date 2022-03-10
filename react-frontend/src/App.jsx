import './App.scss';
import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/LoginPage/Login';
// import Homepage from './components/Homepage/Homepage';
import BackendConnector from './components/BackendConnector/BackendConnector';

export const AuthContext = createContext();

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, userAddress, setUserAddress }}>
      <Router>
        <Routes>
          {/* <Route path="/" element={(authenticated && userAddress) ? <Homepage /> : <Login />} /> */}
          <Route path="/" element={<BackendConnector />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;