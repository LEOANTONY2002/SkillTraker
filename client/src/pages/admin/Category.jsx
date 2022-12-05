import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Axios } from '../../axios'
import { getCategories } from '../../redux/slices/adminSlice'
import './Category.css'

function Category() {
    const { categories, skills } = useSelector((state) => state.admin)
    const [edit, setEdit] = useState({
        open: false,
        category: '',
        newCategory: ''
    })
    const [newCat, setNewCat] = useState('')
    const dispatch = useDispatch()

    const catSkills = (cat) => {
        const sk = skills.map(s => {
            if (s.category === cat) return s.name
        })
        console.log(sk)
        return sk
    }

    const addCategory = async () => {
        const { data } = await Axios.post("/admin/category", {
            name: newCat,
        })
        dispatch(getCategories(data))
    }

    const updateCat = async () => {
        const { data } = await Axios.put("/admin/category", {
            name: edit.category,
            newName: edit.newCategory
        })
        dispatch(getCategories(data))
        setEdit({ open: false })
    }

    const deleteCat = async (cat) => {
        const { data } = await Axios.delete(`/admin/category/${cat}`)
        dispatch(getCategories(data))
        setEdit({ open: false })
    }

    console.log(newCat)

    return (
        <>
            <div className='category'>
                <div className="c-add">
                    <p>Add Category</p>
                    <div className="ca-inp">
                        <input type="text" placeholder='New Category' value={newCat} onChange={e => setNewCat(e.target.value)} />
                        <img onClick={() => addCategory()} src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png" />
                    </div>
                </div>
                <div className="c-list">
                    {categories && categories.map(c => (
                        <div className="cl-cat">
                            <div className="cl-head">
                                <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" />
                                <div>
                                    <p>{c.name}</p>
                                    <img onClick={() => setEdit({
                                        open: true,
                                        category: c.name,
                                        newCategory: c.name
                                    })} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/pencil.png" />
                                    <img onClick={() => deleteCat(c._id)} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/delete.png" />
                                </div>
                            </div>
                            <div className="cl-body">
                                {catSkills(c.name).map(s => (
                                    s && <p>{s}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                    {/* <p>{Object.keys(categories).length}</p> */}
                </div>
            </div>
            {edit.open && (
                <div className='c-edit'>
                    <div>
                        <div className="ce-head">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" />
                            <p>Edit Category</p>
                            <img onClick={() => setEdit({ open: false })} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" />
                        </div>
                        <div className="ce-body">
                            <p>{edit.newCategory}</p>
                            <input type="text" placeholder='Category' value={edit.newCategory} onChange={e => setEdit({ ...edit, newCategory: e.target.value })} />
                            <button onClick={() => updateCat()}>Update</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Category