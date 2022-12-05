import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Axios } from '../../axios'
import Error from '../../components/Error'
import { getUser } from '../../redux/slices/userSlice'
import './Profile.css'

function Profile() {
    const { user, accessToken } = useSelector((state) => state.user)
    const [skills, setSkills] = useState([])
    const [userSkill, setUserSkill] = useState([])
    const [skill, setSkill] = useState({
        open: false,
        skills: [...user.skills]
    })
    const [err, setErr] = useState({
        open: false,
        msg: ''
    })
    const dispatch = useDispatch()
    const cancelToken = axios.CancelToken.source()

    useEffect(() => {
        Axios.get('/admin/skill', { headers: { "Authorization": `Bearer ${accessToken}` } }, { cancelToken: cancelToken.token })
            .then(async ({ data }) => {
                await setSkills(data)
            })
            .catch((err) => {
                if (axios.isCancel(err)) console.log("Cancel!")
            })

        console.log("APIIIII")


        return () => {
            cancelToken.cancel()
        }
    }, [])

    useEffect(() => {
        const set = async () => {
            let arr = []
            await setUserSkill([])
            await user?.skills.length !== 0 ? user?.skills.map(s => {
                arr.push({ skill: s?.skill._id, exp: s?.exp })
            }) : setUserSkill([])
            setSkill({ ...skill, skills: user.skills })
            await setUserSkill(arr)
        }
        set()
    }, [skill.open])

    console.log("S", skill)
    console.log("US", userSkill)

    const update = async () => {
        try {
            const { data } = await Axios.put("/user/skill", { email: user.email, skills: userSkill }, { headers: { "Authorization": `Bearer ${accessToken}` } },)
            dispatch(getUser(data))
            setSkill({ open: false, skills: user.skills })
        } catch ({ response }) {
            setErr({
                open: true,
                msg: response.data
            })
        }
    }

    const addSkill = async (s, exp) => {
        console.log("add", s)
        let check = await userSkill.find(us => (
            us.skill === s._id
        ))
        console.log(check)
        if (!check) {
            await setSkill({ ...skill, skills: [...skill.skills, { skill: s, exp }] });
            await setUserSkill([...userSkill, { skill: s._id, exp }])
        } else {
            let index = await userSkill.findIndex(us => us.skill === s._id)
            await setUserSkill(
                [
                    ...userSkill.slice(0, index),
                    Object.assign({}, userSkill[index], { skill: s._id, exp }),
                    ...userSkill.slice(index + 1)
                ]
            )
            await setSkill({
                ...skill,
                skills: [
                    ...skill.skills.slice(0, index),
                    Object.assign({}, skill.skills[index], { skill: s, exp }),
                    ...skill.skills.slice(index + 1)
                ]
            })
        }
    }

    const delSkill = async (s) => {
        console.log("delll", s)
        let upd = await skill.skills.filter(sk => sk.skill._id !== s.skill._id)

        console.log(upd)
        setSkill({ ...skill, skills: [...upd] })
        if (upd.length !== 0) {
            setUserSkill(us =>
                us.filter(u => { return u.skill !== s.skill._id })
            )
        } else {
            setUserSkill([])
        }
    }

    return (
        <>
            <div className='profile'>
                <div className="p-img">
                    <img style={user.photo !== "" ? { padding: "0px", width: "100px", height: "100px" } : { padding: "20px" }} src={user.photo !== "" ? user.photo : "https://img.icons8.com/fluency-systems-regular/70/ffffff/group-background-selected.png"} alt="" />
                </div>
                <div className="p-title">
                    <p>{user.name}</p>
                    <span>{user.email}</span>
                </div>
                <div className="p-skills">
                    <div className="ps-head">
                        <p>Skills</p>
                        <span></span>
                        <img onClick={() => setSkill({ ...skill, open: true })} src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png" />
                    </div>
                    <div className="psks">
                        {user.skills.length !== 0 ? user.skills.map(s => (
                            <div key={s.skill._id} className='psk'>
                                <p>{s.skill.name}</p>
                                <h6></h6>
                                <span style={s?.exp !== "Beginner" ? s?.exp === "Intermediate" ? { color: '#ffbfac' } : { color: '#ff815a' } : { color: '#fde5e5' }}>{s.skill.category.name}</span>
                            </div>
                        )) : (
                            <h6>Add your skills</h6>
                        )
                        }
                    </div>
                </div>
            </div>
            {skill.open &&
                <div className="e-skill">
                    <div className="s-add">
                        <div style={{ width: "100%" }} className="ce-head">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/light-on--v1.png" />
                            <p>Edit Skill</p>
                            <img onClick={() => {
                                setSkill({ open: false, skills: [...user.skills] })
                            }} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" />
                        </div>
                        <div className="sa-body">
                            <div>
                                {skill.skills.length !== 0 && skill.skills.map(s => (
                                    <div onClick={() => delSkill(s)} style={s?.exp !== "Beginner" ? s?.exp === "Intermediate" ? { backgroundColor: '#ffbfac', color: 'white' } : { backgroundColor: '#ff815a', color: 'white' } : { backgroundColor: '#fde5e5', color: 'white' }} className="sab-sk">
                                        <p>{s?.skill?.name}</p>
                                        <span style={{ color: "white" }}>{s?.skill?.category?.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className='sel'>Select your skills <span></span> </p>
                                {skills.length !== 0 && skills.map(s => (
                                    <div className='sab'>
                                        <div className="sab-sk">
                                            <p>{s?.name}</p>
                                            <span>{s?.category?.name}</span>
                                        </div>
                                        <section className="sab-exp">
                                            <p onClick={() => addSkill(s, "Beginner")}>Beginner</p>
                                            <p onClick={() => addSkill(s, "Intermediate")}>Intermediate</p>
                                            <p onClick={() => addSkill(s, "Advanced")}>Advanced</p>
                                        </section>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => update()}>Update</button>
                    </div>
                </div>
            }
            {err.open && <div className="err">
                <Error err={err} setErr={setErr} />
            </div>}
        </>
    )
}

export default Profile