import React, { memo } from 'react'
import './Nav.css'
import logo from '../../assets/icon.svg'
import { useNavigate } from 'react-router-dom'

function Nav() {
    
    const navigate = useNavigate()

    return (
        <div className="menu">
            <span className='cx'>
                <img src={logo} alt="" />
            </span>
            <div className="nav">
                <div onClick={() => navigate('/admin')}>
                    <img src="https://img.icons8.com/material-outlined/48/ffffff/dashboard-layout.png" alt='' />
                    <p>Dashboard</p>
                </div>
                <div onClick={() => navigate('/admin/employee')}>
                    <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/group-background-selected.png" alt='' />
                    <p>Employees</p>
                </div>
                <div onClick={() => navigate('/admin/category')}>
                    <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/category.png" alt='' />
                    <p>Categories</p>
                </div>
                <div onClick={() => navigate('/admin/skill')}>
                    <img src="https://img.icons8.com/material-outlined/48/ffffff/light-on--v1.png" alt='' />
                    <p>Skills</p>
                </div>
            </div>
        </div>
    )
}

export default memo(Nav)