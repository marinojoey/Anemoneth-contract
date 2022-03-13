// import './HomeOrLogin.css';
// import React , { useState, createContext } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// // import Login from './components/LoginPage/Login';
// import Homepage from '../Homepage/Homepage';
// import Login from '../Login/Login'
// import Navbar from '../Navbar/Navbar';

// export const AuthContext = createContext();

// function HomeOrLogin() {
//   const [isUser, setUser] = useState(false);
//   const [connected, setConn] = useState(false);
//   const [addr1, setAddr1] = useState(0);
//   const [dispAddr, setDispAddr] = useState("")
//   const [clwnblnc, setclwnblnc] = useState(0)
//   const [username, setUsername] = useState("")

//   // console.log(username)

//   return (
//     <>
//         <Navbar clwnblnc={clwnblnc} dispAddr={dispAddr} username={username} connected={connected} />
//         { (isUser) ?
//             <Homepage isUser={isUser} connected={connected} addr1={addr1} /> :
//             <Login setUser={setUser} setConn={setConn} setAddr1={setAddr1} setclwnblnc={setclwnblnc} setDispAddr={setDispAddr} setUsername={setUsername} addr1={addr1} connected={connected} />
//         }

//         {/* <AuthContext.Provider value={isUser}>
//         <Router>
//             <Routes>
//             <Route path="/"
//                 element = { (isUser) ?
//                 <Homepage isUser={isUser} connected={connected} addr1={addr1} /> :
//                 <Login setUser={setUser} setConn={setConn} setAddr1={setAddr1} setclwnblnc={setclwnblnc} setDispAddr={setDispAddr} setUsername={setUsername} addr1={addr1} connected={connected} />} />
//             </Routes>
//         </Router>
//         </AuthContext.Provider> */}
//     </>
//   );
// }

// export default HomeOrLogin;
