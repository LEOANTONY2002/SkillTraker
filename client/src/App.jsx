import './App.css';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/user/Home';
import Admin from './pages/admin/Admin';
import { useSelector } from 'react-redux';
import Login from './pages/user/Login';

function App() {
  const { user } = useSelector((state) => state.user)

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* <Route path='/admin' element={<Admin />} /> */}
          {user.length !== 0 ?
            user.email === "admin@changecx.com"
              ? <Route path='/' element={<Admin />} />
              : <Route path='/' element={<Home />} />
            : <Route path='/' element={<Login />} />}
          <Route path='/employee/login' element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
