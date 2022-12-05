import axios from 'axios'
import React, { useEffect, useMemo } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileBase64 from 'react-file-base64';
import './Edit.css'
import { Axios } from '../../axios';
import { getUser } from '../../redux/slices/userSlice';
import { memo } from 'react';
import Error from '../../components/Error';

function Edit({ setPage }) {
    const { user } = useSelector((state) => state.user)
    const [edit, setEdit] = useState({
        name: user.name,
        email: user.email,
        photo: user.photo
    })
    const [err, setErr] = useState({
        open: false,
        msg: ''
    })
    const dispatch = useDispatch()

    const getFiles = (p) => {
        setEdit({ ...edit, photo: p.base64 })
    }

    const update = async () => {
        try {
            const { data } = await Axios.put("/user/edit", edit)
            await dispatch(getUser(data))
            setPage("profile")
        } catch ({ response }) {
            console.log(response)
            setErr({
                open: true,
                msg: response
            })
        }
    }

    return (
        <>
            <div className='login'>
                <div>
                    <div className="l-body">
                        <div className="lb-up">
                            <img style={edit.photo !== '' ? { padding: 0, width: "70px", height: "70px" } : {}} src={edit.photo === '' ? "https://img.icons8.com/fluency-systems-regular/52/ffffff/group-background-selected.png" : edit.photo} />
                            <div>
                                <FileBase64 onDone={getFiles.bind(this)} />
                                <img src="https://img.icons8.com/fluency-systems-filled/25/fc3737/camera.png" />
                            </div>
                        </div>
                        <h2>{edit.name}</h2>
                        <input type="text" placeholder='Name' value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} />
                        {/* <input type="Password" placeholder='Password' value={edit.password} onChange={e => setEdit({ ...edit, password: e.target.value })} /> */}
                        <button onClick={() => update()}>Update</button>
                    </div>
                </div>
            </div>
            <Error err={err} setErr={setErr} />
        </>
    )
}

export default memo(Edit)