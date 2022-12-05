import React from 'react'
import './Dashboard.css'
import { Line, LineChart, CartesianGrid, YAxis, XAxis, Tooltip, Legend } from 'recharts'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

function Dashboard({ users, categories, skills, counts }) {

    console.log(counts)
    const [category, setCategory] = useState([])
    const [skill, setSkill] = useState([])
    const [edit, setEdit] = useState({
        open: false,
        admin: {
            email: '',
            password: ''
        }
    })
    const { user } = useSelector(state => state.user)

    useEffect(() => {
        setEdit({ ...edit, admin: { ...edit.admin, email: user.email } })
        return (() => { })
    }, [user.email])

    useEffect(() => {

        const chart = async () => {
            let cat = []
            await Object.keys(counts.category).forEach(async (k) => {
                await cat.push({
                    "name": k,
                    "skills": counts.category[k]
                })
            })
            await setCategory(cat)

            let sk = []
            await Object.keys(counts.skill).forEach(async (k) => {
                await sk.push({
                    "name": k,
                    "employees": counts.skill[k]
                })
            })
            await setSkill(sk)
        }

        chart()
    }, [counts])

    const updateSkill = () => { }

    return (
        <div className="dashboard">
            <div className="d-left">
                <div className="d-mixed">
                    <p className='d-title'>Overview</p>
                    <div className='contents dm-cont'>
                        <div>
                            <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png" />
                            <p>Employees</p>
                            <div className='gt'>{users.length}</div>
                        </div>
                        <div>
                            <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/category.png" />
                            <p>Categoeries</p>
                            <div className='gt'>{categories.length}</div>
                        </div>
                        <div>
                            <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png" />
                            <p>Skills</p>
                            <div className='gt'>{skills.length}</div>
                        </div>
                    </div>
                    <div className="chart">
                        <div className='ad-head'>
                            <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" />
                            <p>Admin</p>
                        </div>
                        <div className='ad-body'>
                            <p style={{ fontSize: 'small' }}>{user.email}</p>
                            <button onClick={() => setEdit({ ...edit, open: true })}>Update</button>
                        </div>
                    </div>
                </div>
                <div className="d-cats">
                    <p className='d-title'>Categories</p>
                    <div className='contents dc-cont'>
                        {categories ? categories.map(c => (
                            <div key={c._id}>
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/category.png" />
                                <p>{c.name}</p>
                                <div className="dc-count">
                                    <h6>skills</h6>
                                    <span>{counts.category[c.name]}</span>
                                </div>
                            </div>
                        )) : <div></div>}
                    </div>
                    <div className="chart">
                        <LineChart width={280} height={130} data={category}
                            margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="skills" stroke="#fc3737" />
                        </LineChart>
                    </div>
                </div>
                <div className="d-cats">
                    <p className='d-title'>Skills</p>
                    <div className='contents dc-cont'>
                        {skills ? skills.map(c => (
                            <div key={c._id} className="sk-body">
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/light-on--v1.png" />
                                <div className='sb-cont'>
                                    <p>{c.name}</p>
                                    <span><h6></h6>{c.category.name}</span>
                                </div>
                                <div className="dc-count">
                                    <h6>users</h6>
                                    <span>{counts.skill[c.name] | 0}</span>
                                </div>
                            </div>
                        )) : <div></div>}
                    </div>
                    <div className="chart">
                        <LineChart width={280} height={130} data={skill}
                            margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="employees" stroke="#fc3737" />
                        </LineChart>
                    </div>
                </div>
            </div>
            <div className="users">
                <h5>Employees</h5>
                {users ? users.map(u => {
                    if (u.email !== "admin@changecx.com") return (

                        <div key={u._id} className='u-cont'>
                            <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png" />
                            <div>
                                <p>{u.name}</p>
                                <span>{u.email}</span>
                            </div>
                        </div>
                    )
                }) : <div>No users found</div>}
            </div>

            {edit.open && (
                <div style={{ position: "fixed" }} className='c-edit'>
                    <div>
                        <div className="ce-head">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" />
                            <p>Edit Admin</p>
                            <img onClick={() => setEdit({ ...edit, open: false })} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" />
                        </div>
                        <div className="ce-body">
                            <p style={{ fontSize: "small" }}>{edit.admin.email}</p>
                            <input style={{ marginBottom: "20px" }} type="text" placeholder='Email' value={edit.admin.email} onChange={e => setEdit({ ...edit, admin: { ...edit.admin, email: e.target.value } })} />
                            <input type="password" placeholder='Password' value={edit.admin.password} onChange={e => setEdit({ ...edit, admin: { ...edit.admin, password: e.target.value } })} />
                            <button onClick={() => updateSkill()}>Update</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Dashboard