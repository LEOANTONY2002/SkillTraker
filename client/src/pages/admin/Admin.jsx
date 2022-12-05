import React, { memo } from 'react'
import './Admin.css'
import logo from '../../assets/icon.svg'
import { useEffect } from 'react'
import { getCategories, getSkills, getUsers } from '../../redux/slices/adminSlice'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Axios } from '../../axios'
import axios from 'axios'
import Dashboard from './Dashboard'
import Employee from './Employee'
import Category from './Category'
import Skill from './Skill'

function Admin() {
    const { users, categories, skills } = useSelector((state) => state.admin)
    const dispatch = useDispatch()
    const cancelToken = axios.CancelToken.source()
    const [counts, setCounts] = useState({
        category: {},
        skill: {}
    })
    const [page, setPage] = useState('dashboard')

    // const userMemo = useMemo(() => ({
    //     users: users
    // }), [users])

    useEffect(() => {
        Axios.get('/user/all', { cancelToken: cancelToken.token })
            .then(({ data }) => dispatch(getUsers(data)))
            .catch((err) => {
                if (axios.isCancel(err)) console.log("Cancel!")
            })

        Axios.get('/admin/category', { cancelToken: cancelToken.token })
            .then(({ data }) => dispatch(getCategories(data)))
            .catch((err) => {
                if (axios.isCancel(err)) console.log("Cancel!")
            })

        Axios.get('/admin/skill', { cancelToken: cancelToken.token })
            .then(({ data }) => dispatch(getSkills(data)))
            .catch((err) => {
                if (axios.isCancel(err)) console.log("Cancel!")
            })

        console.log("APIIIII")
        return () => {
            cancelToken.cancel()
        }
    }, [])

    console.log(users)

    useEffect(() => {
        let sk = {
            category: {},
            skill: {}
        }
        categories.map(async (c) => {
            let count = await skills.filter(s => s.category.name === c.name)
            sk.category[c.name] = count.length
        })
        users.map(u => {
            if (u.skills.length !== 0) {
                u.skills.map(async (c) => {
                    let count = await skills.find(s => s?.name === c.skill.name)
                    if (sk.skill.hasOwnProperty(c.skill.name)) sk.skill[c.skill.name] += 1
                    else sk.skill[c.skill.name] = 1
                })
            }
        })
        setCounts(sk)
    }, [skills, categories])


    return (
        <div className='admin'>
            <div className="menu">
                <span className='cx'>
                    <img src={logo} alt="" />
                </span>
                <div className="nav">
                    <div onClick={() => setPage('dashboard')}>
                        <img src="https://img.icons8.com/material-outlined/48/ffffff/dashboard-layout.png" />
                        <p>Dashboard</p>
                    </div>
                    <div onClick={() => setPage('employee')}>
                        <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/group-background-selected.png" />
                        <p>Employees</p>
                    </div>
                    <div onClick={() => setPage('category')}>
                        <img src="https://img.icons8.com/fluency-systems-regular/48/ffffff/category.png" />
                        <p>Categories</p>
                    </div>
                    <div onClick={() => setPage('skill')}>
                        <img src="https://img.icons8.com/material-outlined/48/ffffff/light-on--v1.png" />
                        <p>Skills</p>
                    </div>
                </div>
            </div>
            <main>
                {page === "dashboard" && <Dashboard users={users} categories={categories} skills={skills} counts={counts} />}
                {page === "employee" && <Employee users={users} categories={categories} skills={skills} counts={counts} />}
                {page === "category" && <Category users={users} categories={categories} skills={skills} counts={counts} />}
                {page === "skill" && <Skill users={users} categories={categories} skills={skills} counts={counts} />}
            </main>
        </div>
    )
}

export default memo(Admin)