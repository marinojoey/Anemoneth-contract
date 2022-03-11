import './App.scss';
import React , { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/LoginPage/Login';
import Homepage from './components/Homepage/Homepage';
import Login from './components/Login/Login'

export const AuthContext = createContext();

function App() {
  const [isUser, setUser] = useState(false);

  return (
    <AuthContext.Provider value={isUser}>
      <Router>
        <Routes>
          <Route path="/" element={(isUser) ? <Homepage /> : <Login setUser={setUser} />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
