import React from 'react'
import './Dashboard.css'
import { Line, LineChart, YAxis, XAxis, Tooltip, Legend } from 'recharts'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetAllEmployees } from '../../graphql/query/useGetAllEmployees'
import { useGetAllSkills } from '../../graphql/query/useGetAllSkills'
import { useGetAllCategories } from '../../graphql/query/useGetAllCategories'
import { useNavigate } from 'react-router-dom'
import Nav from './Nav'
import { getCategories, getEmployees, getSkills } from '../../redux/slices/adminSlice'

function Dashboard() {

    const [category, setCategory] = useState([])
    const [skill, setSkill] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading: gettingEmployees, employees: employees=[], error: errorEmployees} = useGetAllEmployees()
    const {loading: gettingSkills, skills: skills=[], error: errorSkills} = useGetAllSkills()
    const {loading: gettingCategories, categories: categories=[], error: errorCategories} = useGetAllCategories()



    const chart = async () => {
        let cat = []
        await categories.forEach(async (c) => {
            cat.push({
                "name": c?.name,
                "skills": c?.skills?.length
            })
        })
        setCategory(cat)

        let sk = []
        await skills.forEach(async (s) => {
            sk.push({
                "name": s?.skill?.name,
                "employees": s?.employeeSkills?.length
            })
        })
        setSkill(sk)
    }

    useEffect(() => {
        chart()
        
    }, [])

    chart()

    useEffect(() => {
        dispatch(getEmployees(employees))
        dispatch(getSkills(skills))
        dispatch(getCategories(categories))
    }, [skills])

    return (
        <>
        <div className="dashboard">
            <div className="d-left">
                <div className="d-mixed">
                    <p className='d-title'>Overview</p>
                    <div className='contents dm-cont'>
                        <div>
                            <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png" alt=''/>
                            <p>Employees</p>
                            <div className='gt'>{employees.length - 1}</div>
                        </div>
                        <div>
                            <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/category.png" alt=''/>
                            <p>Categoeries</p>
                            <div className='gt'>{categories.length}</div>
                        </div>
                        <div>
                            <img src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png" alt=''/>
                            <p>Skills</p>
                            <div className='gt'>{skills.length}</div>
                        </div>
                    </div>
                    {/* <div className="chart">
                        <div className='ad-head'>
                            <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" alt=''/>
                            <p>Admin</p>
                        </div>
                        <div className='ad-body'>
                            <p style={{ fontSize: 'small' }}>{user.email}</p>
                            <button onClick={() => setEdit({ ...edit, open: true })}>Update</button>
                        </div>
                    </div> */}
                </div>
                <div className="d-cats">
                    <div className='d-title'>
                        <p>Categories</p>
                        <span></span>
                        <img onClick={() => navigate("/admin/category")} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt='' />
                    </div>
                    <div className='contents dc-cont'>
                        {categories ? categories.map(c => (
                            <div key={c?.id}>
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/category.png" alt='' />
                                <p>{c?.name}</p>
                                <div className="dc-count">
                                    <h6>skills</h6>
                                    <span>{c?.skills?.length}</span>
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
                    <div className='d-title'>
                        <p>Skills</p>
                        <span></span>
                        <img onClick={() => navigate("/admin/skill")} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                    </div>
                    <div className='contents dc-cont'>
                        {skills ? skills.map(s => (
                            <div key={s?.id} className="sk-body">
                                <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/light-on--v1.png" alt=''/>
                                <div className='sb-cont'>
                                    <p>{s?.skill?.name}</p>
                                    <span><h6></h6>{s?.category.name}</span>
                                </div>
                                <div className="dc-count">
                                    <h6>emp</h6>
                                    <span>{s?.employeeSkills?.length}</span>
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
            <div className="users" >
                <div className='d-title' style={{ position: "relative", fontSize: "small", fontWeight: "bold", marginLeft: "-10px", marginBottom: "20px", marginTop: "-10px" }}>
                    <p>Employees</p>
                    <span></span>
                    <img onClick={() => navigate("/admin/employee")} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/forward.png" alt=''/>
                </div>
                {employees ? employees.map(e => {
                    if (e?.email !== "admin@changecx.com") return (
                        <div key={e?.id} className='u-cont'>
                            <img src={e?.photo !== "" ? e?.photo : "https://img.icons8.com/fluency-systems-regular/48/fc3737/group-background-selected.png"} alt='' />
                            <div>
                                <p>{e?.name}</p>
                                <span>{e?.email}</span>
                            </div>
                        </div>
                    )
                }) : <div>No empoyees found</div>}
            </div>

        </div>
        
        <Nav />
        </>
    )
}

export default Dashboard