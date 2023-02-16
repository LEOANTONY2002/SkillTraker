import axios from 'axios'
import React, { useEffect} from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileBase64 from 'react-file-base64';
import './Login.css'
import { getUser, getUserAccessToken } from '../../redux/slices/userSlice';
import { memo } from 'react';
import Error from '../../components/Error';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../graphql/mutation/useLogin';
import { useSignup } from '../../graphql/mutation/useSignup';

function Login() {
    const { user } = useSelector((state) => state.user)
    const { login: onLogin } = useLogin();
    const { signup: onSignup } = useSignup();

    const [login, setLogin] = useState({
        name: '',
        email: '',
        password: '',
        photo: '',
        skills: []
    })
    const [signup, setSignup] = useState(false)
    const [err, setErr] = useState({
        open: false,
        msg: ''
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cancelToken = axios.CancelToken.source()

    console.log(user.name)

    useEffect(() => {
        setLogin({
            name: '',
            email: '',
            password: '',
            photo: '',
            skills: []
        })
    }, [signup])

    console.log(login.photo)

    const getFiles = (p) => {
        setLogin({ ...login, photo: p.base64 })
    }

    const authenticate = async () => {
        if (login.email === '' | login.password === '') {
            setErr({
                open: true,
                msg: "Enter Email and Password!"
            })
        } else if (login.email.slice(-13) !== "@changecx.com") setErr({
            open: true,
            msg: "Enter Organization Email!"
        })
        else {
            if (signup) {
                try {
                    await onSignup({
                        variables: {
                            name: login.name,
                            email: login.email,
                            password: login.password
                        }
                    }).then(({ data, error }) => {
                        if (data) {
                            console.log(data)
                            if (data.addEmployee !== null) {
                                dispatch(getUser(data?.addEmployee))
                                if (data?.addEmployee?.email === "admin@changecx.com") {
                                    navigate('/admin')
                                } else {
                                    navigate('/employee')
                                }
                                // dispatch(getUserAccessToken(data.accessToken))
                                setLogin({
                                    name: '',
                                    email: '',
                                    password: '',
                                    photo: '',
                                    skills: []
                                })
                            }
                            else setErr({ open: true, msg: "Invalid Credentials" })
                        }
                        if (error) {
                            setErr(error.message)
                            console.log(error)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                        
                } catch ({ response }) {
                    setErr({
                        open: true,
                        msg: response.data
                    })
                }
            } else {
                try {
                    await onLogin({
                        variables: {
                            email: login.email,
                            password: login.password
                        }
                    }).then(({ data, error }) => {
                        console.log("EMPLOYEE", data)
                        if (data?.employeeLogin !== null) {
                                dispatch(getUser(data?.employeeLogin))
                                if (data?.employeeLogin?.email === "admin@changecx.com") {
                                    navigate('/admin')
                                } else {
                                    navigate('/employee')
                                }
                                // dispatch(getUserAccessToken(data.accessToken))
                                setLogin({
                                    name: '',
                                    email: '',
                                    password: '',
                                    photo: '',
                                    skills: []
                                })
                            
                        } else setErr({ open: true, msg: "Invalid Credentials" })

                        if (error) {
                            setErr({open: error.message})
                            console.log(error)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                        
                } catch ({ response }) {
                    setErr({
                        open: true,
                        msg: response.data
                    })
                }
            }
        }
    }

    return (
        <>
            <div className='login'>
                <div>
                    <div className="l-head">
                        <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png" alt='' />
                        <span></span>
                        <p>Employee</p>
                    </div>
                    <div className="l-body">
                        {signup && (
                            <div className="lb-up">
                                <img style={login.photo !== '' ? { padding: 0, width: "70px", height: "70px" } : {}} src={login.photo === '' ? "https://img.icons8.com/fluency-systems-regular/52/ffffff/group-background-selected.png" : login.photo} alt="" />
                                <div>
                                    <FileBase64 onDone={getFiles.bind(this)} />
                                    <img src="https://img.icons8.com/fluency-systems-filled/25/fc3737/camera.png" alt='' />
                                </div>
                            </div>
                        )}
                        {signup && (
                            <input type="text" placeholder='Name' value={login.name} onChange={e => setLogin({ ...login, name: e.target.value })} />
                        )}
                        <input type="text" placeholder='Email' value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
                        <input type="Password" placeholder='Password' value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
                        <button onClick={() => authenticate()}>{signup ? 'Signup' : 'Login'}</button>
                    </div>
                    {signup ? <p>Present Employee? <span onClick={() => setSignup(false)}>Login</span> </p> : <p>New Employee? <span onClick={() => setSignup(true)}>Signup</span> </p>}
                </div>
            </div>
            {err.open && <Error err={err} setErr={setErr} />}
        </>
    )
}

export default memo(Login)