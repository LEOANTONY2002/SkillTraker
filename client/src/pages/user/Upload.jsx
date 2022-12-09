import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileBase64 from 'react-file-base64';
import './Upload.css'
import { Axios } from '../../axios';
import { getUser } from '../../redux/slices/userSlice';

function Upload() {
    const { user, accessToken } = useSelector((state) => state.user)
    const [cert, setCert] = useState({
        open: false,
        id: '',
        name: '',
        publisher: '',
        exp: '',
        photo: ''
    })
    const [edit, setEdit] = useState({
        open: false,
        cert: {}
    })
    const dispatch = useDispatch()

    console.log(user)

    useEffect(() => { })

    const getFiles = (p) => {
        setCert({ ...cert, photo: p.base64 })
    }

    const upload = async () => {
        try {
            const { data } = await Axios.put("/user/skill/cert", { email: user.email, skill: cert.id, cert: { name: cert.name, publisher: cert.publisher, exp: cert.exp, photo: cert.photo } }, { headers: { "Authorization": `Bearer ${accessToken}` } },)
            dispatch(getUser(data))
            setCert({ ...cert, open: false })
        } catch ({ response }) {
            // setErr({
            //     open: true,
            //     msg: response.data
            // })
        }
    }

    return (
        <div className='upload'>
            {user?.skills?.length !== 0 && user?.skills?.map(s => (
                <div className='u-main'>
                    <div className="u-skill">
                        <div className="us-head">
                            <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/light-on--v1.png" />
                            <div>
                                <p>{s?.skill?.name}</p>
                                <h4></h4>
                                <span>{s?.skill?.category?.name}</span>
                            </div>
                        </div>
                        <div className="us-body">
                            <span></span>
                            <img onClick={() => setCert({ ...cert, open: true, id: s._id })} src="https://img.icons8.com/fluency-systems-regular/48/ffffff/upload.png" />
                        </div>
                    </div>
                    <div className="u-cert">
                        <img src="" alt="" />
                    </div>
                </div>
            ))}

            {edit.open && <div className="u-edit">
            </div>}

            {cert.open &&
                <div className='u-upl'>
                    <div className="l-body">
                        <img onClick={() => {
                            setCert({ ...cert, open: false })
                        }} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" />
                        <div>
                            <div className="lb-up">
                                <img style={cert.photo !== '' ? { padding: 0, width: "70px", height: "70px" } : {}} src={cert.photo === '' ? "https://img.icons8.com/fluency-systems-regular/52/ffffff/group-background-selected.png" : cert.photo} />
                                <div>
                                    <FileBase64 onDone={getFiles.bind(this)} />
                                    <img src="https://img.icons8.com/fluency-systems-filled/25/fc3737/camera.png" />
                                </div>
                            </div>
                        </div>
                        <input type="text" placeholder='Name' value={cert.name} onChange={e => setCert({ ...cert, name: e.target.value })} />
                        <input type="text" placeholder='Publisher' value={cert.publisher} onChange={e => setCert({ ...cert, publisher: e.target.value })} />
                        <p style={{ textAlign: 'left', width: '100%', marginBottom: '-10px' }}>Expiry</p>
                        <input style={{ textIndent: '10px', paddingRight: '10px', width: '280px' }} type="date" onChange={e => setCert({ ...cert, exp: e.target.value })} />
                        <button onClick={() => upload()}>Upload</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Upload