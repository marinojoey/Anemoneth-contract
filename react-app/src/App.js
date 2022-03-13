import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authenticate } from './store/session';

import LoginForm from './components/Auth/LoginForm';
import SignUpForm from './components/Auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
// import UsersList from './components/UsersList';
// import User from './components/User';
// import HomeOrLogin from './components/HomeOrLogin/HomeOrLogin';

import Homepage from './components/Homepage/Homepage';
import Login from './components/Login/Login'
import Navbar from './components/Navbar/Navbar';

export const AuthContext = createContext();

function App() {
  const [isUser, setUser] = useState(false);
  const [connected, setConn] = useState(false);
  const [addr1, setAddr1] = useState(0);
  const [dispAddr, setDispAddr] = useState("")
  const [clwnblnc, setclwnblnc] = useState(0)
  const [username, setUsername] = useState("")

  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Navbar clwnblnc={clwnblnc} dispAddr={dispAddr} username={username} connected={connected} />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        {/* <ProtectedRoute path='/users' exact={true} >
          <UsersList/>
        </ProtectedRoute> */}
        {/* <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute> */}
        <ProtectedRoute path='/' exact={true} >
          <h1>My Home Page</h1>
          {/* <HomeOrLogin /> */}
          { (isUser) ?
            <Homepage isUser={isUser} connected={connected} addr1={addr1} /> :
            <Login setUser={setUser} setConn={setConn} setAddr1={setAddr1} setclwnblnc={setclwnblnc} setDispAddr={setDispAddr} setUsername={setUsername} addr1={addr1} connected={connected} />
          }
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
