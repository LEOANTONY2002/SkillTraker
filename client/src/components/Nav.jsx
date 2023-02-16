import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/icon.svg'
import "./Nav.css"

function Nav({ shrink, setShrink }) {
    const { user } = useSelector((state) => state.user)
    const navigate = useNavigate()

    console.log(user)

    useEffect(() => {
        user.length === 0 && navigate('/employee/login')
    }, [])

    return (
        <div className={shrink ? 'options shrink' : 'options'} onMouseEnter={() => setShrink(false)} onMouseLeave={() => setShrink(true)}>
            <main >
                <span className='cx'>
                    <img src={logo} alt="" />
                </span>
                <div onClick={() => navigate("/employee/update")} className='h-div'>
                    <p>Edit</p>
                    <div>
                        <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/group-background-selected.png" />
                    </div>
                </div>
                <div onClick={() => navigate("/employee/profile")} className='h-div'>
                    <p>Profile</p>
                    <div>
                        <img src="https://img.icons8.com/material-outlined/48/ffffff/light-on--v1.png" />
                    </div>
                </div>
                <div onClick={() => navigate("/employee/certificate")} className='h-div'>
                    <p>Uploads</p>
                    <div>
                        <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/upload.png" />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Nav