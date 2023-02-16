import './App.css';
import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/user/Home';
import { useSelector } from 'react-redux';
import Login from './pages/user/Login';
import Upload from './pages/user/Upload';
import Edit from './pages/user/Edit';
import Profile from './pages/user/Profile';
import Employee from './pages/admin/Employee';
import Skill from './pages/admin/Skill';
import Category from './pages/admin/Category';
import Dashboard from './pages/admin/Dashboard';
import Nav from './pages/admin/Nav';

function App() {
  const { user } = useSelector((state) => state.user)

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* {user.length !== 0 ?
            user.email === "admin@changecx.com"
              ? <Route path='/' element={<Dashboard />} />
              : <Route path='/employee' element={<Home />} />
            : <Route path='/employee/login' element={<Login />} />
          } */}
          <Route path='/' element={<Home />} />
          <Route path='/admin' element={<Dashboard />} />
          <Route path='/admin/employee' element={<Employee />} />
          <Route path='/admin/skill' element={<Skill />} />
          <Route path='/admin/category' element={<Category />} />

          <Route path='/employee' element={<Home />} />
          <Route path='/employee/profile' element={<Profile />} />
          <Route path='/employee/update' element={<Edit />} />
          <Route path='/employee/certificate' element={<Upload />} />
          <Route path='/employee/login' element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
