import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Nav from '../../components/Nav'
import './Home.css'

function Home() {
    const [shrink, setShrink] = useState(false)
    const { user, accessToken } = useSelector((state) => state.user);

    // useEffect(() => {
    //     if (user.length !== 0) {
    //         connectBambooHR()
    //     }
    // }, [])

    // const connectBambooHR = async () => {
    //     const data = await axios({ url: "https://44d4dec71a54a30986f0ea0a5ddf944ae84a58ec:x@api.bamboohr.com/api/gateway.php/changecx/v1/employees/directory", withCredentials: false, method: 'get' })
    //     console.log(data)
    // }

    return (
        <div className="home">
            <Nav shrink={shrink} setShrink={setShrink} />
        </div>
    )
}

export default Home