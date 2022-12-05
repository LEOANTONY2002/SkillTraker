import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../assets/icon.svg'
import Edit from './Edit'
import './Home.css'
import Profile from './Profile'

function Home() {
    const { user } = useSelector((state) => state.user)
    const [shrink, setShrink] = useState(false)
    const [page, setPage] = useState("home")

    useEffect(() => {
        setTimeout(() => {
            setShrink(true)
        }, 5000)

        return (() => {
        })
    }, [])

    console.log(page)

    const shrinkHandler = async () => {
        setShrink(false)
        await setTimeout(() => { setShrink(true) }, 3000)
    }

    return (
        <div className='home'>
            <main className={shrink && 'shrink'} id={page !== 'home' && 'h-page'} onMouseEnter={() => shrinkHandler()} onClick={() => shrinkHandler()}>
                <span className='cx'>
                    <img src={logo} alt="" />
                </span>
                <div onClick={() => setPage("edit")} className='h-div'>
                    <p>Edit</p>
                    <div>
                        <img src="https://img.icons8.com/material-outlined/48/ffffff/light-on--v1.png" />
                    </div>
                </div>
                <div onClick={() => setPage("profile")} className='h-div'>
                    <p>Profile</p>
                    <div>
                        <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/group-background-selected.png" />
                    </div>
                </div>
                <div onClick={() => setPage("logout")} className='h-div'>
                    <p>Logout</p>
                    <div>
                        <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/exit.png" />
                    </div>
                </div>
            </main>
            {page === "profile" && <Profile />}
            {page === "edit" && <Edit setPage={setPage} />}
        </div>
    )
}

export default Home