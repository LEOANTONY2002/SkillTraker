import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Axios } from '../../axios'
import { useAddCategory, useDeleteCategory } from '../../graphql/mutation/useCategory'
import { getCategories } from '../../redux/slices/adminSlice'
import './Category.css'
import Nav from './Nav'

function Category() {
    const { categories } = useSelector((state) => state.admin)
    const [category, setCategory] = useState({
        open: false,
        id: '',
        name: ''
    })
    const dispatch = useDispatch()
    const {addCategory} = useAddCategory()
    const {deleteCategory} = useDeleteCategory()

    console.log(categories)

    const upsertCategory = async () => {
        let {data} = await addCategory({
            variables: category
        })
        dispatch(getCategories(data?.addCategory))
        setCategory({open: false, id: '', name: ''})
    }

    const deleteCat = async (id) => {
        const { data } = await deleteCategory({
            variables: {id}
        })
        dispatch(getCategories(data?.deleteCategory))
        setCategory({open: false, id: '', name: ''})
    }


    return (
        <>
            <div className='category'>
                <div className="c-add">
                    <p>Add Category</p>
                    <div className="ca-inp">
                        <input type="text" placeholder='New Category' value={category.name} onChange={e => setCategory({...category, name: e.target.value})} />
                        <img onClick={() => upsertCategory()} src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png" alt='' />
                    </div>
                </div>
                <div className="c-list">
                    {categories && categories.map(c => (
                        <div className="cl-cat">
                            <div className="cl-head">
                                <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" alt='' />
                                <div>
                                    <p>{c?.name}</p>
                                    <img onClick={() => setCategory({
                                        open: true,
                                        id: c?.id,
                                        name: c?.name
                                    })} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/pencil.png" alt='' />
                                    <img onClick={() => deleteCat(c?.id)} src="https://img.icons8.com/fluency-systems-regular/48/fc3737/delete.png" alt='' />
                                </div>
                            </div>
                            <div className="cl-body">
                                {c?.skills?.map(s => (
                                    s && <p>{s?.skill?.name}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                    {/* <p>{Object.keys(categories).length}</p> */}
                </div>
            </div>
            {category.open && (
                <div className='c-edit'>
                    <div>
                        <div className="ce-head">
                            <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png" alt='' />
                            <p>Edit Category</p>
                            <img onClick={() => setCategory({ open: false, id: '', name: '' })} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" alt='' />
                        </div>
                        <div className="ce-body">
                            <p>{category.name}</p>
                            <input type="text" placeholder='Category' value={category.name} onChange={e => setCategory({ ...category, name: e.target.value })} />
                            <button onClick={() => upsertCategory()}>Update</button>
                        </div>
                    </div>
                </div>
            )}
            <Nav />
        </>
    )
}

export default Category