import React, { memo } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './Employee.css'

function Employee() {
    const { users, categories, skills } = useSelector((state) => state.admin)
    const [profile, setProfile] = useState({
        open: false,
        user: []
    })

    const cat = (skill) => {
        console.log(skill)
        let ct = {}
        skill.map(s => {
            if (ct.hasOwnProperty(s.skill.category.name)) ct[s.skill.category.name] += 1
            else ct[s.skill.category.name] = 1
        })
        return Object.keys(ct).length
    }

    return (
        <div className='employee'>
            <h4>Employees</h4>
            <div className='e-main'>
                {users && users.map(e => {
                    if (e.email !== "admin@changecx.com") return (
                        <div className="emp">
                            <div className='e-head'>
                                <img style={e.photo !== '' ? { padding: "0px", width: "50px", height: "50px" } : { padding: "10px" }} src={e.photo !== '' ? e.photo : "https://img.icons8.com/fluency-systems-filled/70/fc3737/collaborator-male.png"} />
                                <div className='e-title'>
                                    <div>
                                        <p>{e.name}</p>
                                        <span>{e.email}</span>
                                    </div>
                                    <img onClick={() => setProfile({ open: true, user: e })} src="https://img.icons8.com/fluency-systems-filled/30/ffffff/forward.png" />
                                </div>
                            </div>
                            <div className="e-body">
                                <p>{cat(e.skills)}</p>
                                <span>Categories</span>
                                <p>{e.skills.length}</p>
                                <span>Skills</span>
                            </div>
                        </div>
                    )
                })}

            </div>

            {profile.open && (
                <div className='u-prof'>
                    <img onClick={() => {
                        setProfile({ open: false, user: [] })
                    }} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" />
                    <div className="up-main">
                        <div className="up-head">
                            <div>
                                <img style={profile.user.photo !== '' ? { padding: "0px", width: "120px", height: "120px" } : { padding: "20px" }} src={profile.user.photo !== '' ? profile.user.photo : "https://img.icons8.com/fluency-systems-filled/100/fc3737/collaborator-male.png"} />
                            </div>
                            <p></p>
                        </div>
                        <div className="up-title">
                            <p>{profile.user.name}</p>
                            <span>{profile.user.email}</span>
                        </div>
                    </div>
                    <div className="up-body">
                        {profile.user.skills.map(s => (
                            <div className="eb-skill">
                                <div className="ebs-head">
                                    <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png" />
                                    <div>
                                        <p>{s.skill.name}</p>
                                        <span>{s.skill.category.name}</span>
                                    </div>
                                </div>
                                <h5 style={s?.exp !== "Beginner" ? s?.exp === "Intermediate" ? { backgroundColor: '#ffbfac', color: 'white' } : { backgroundColor: '#ff815a', color: 'white' } : { backgroundColor: '#fde5e5', color: 'white' }}>{s.exp}</h5>
                                <h6>{s.upd}</h6>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(Employee)