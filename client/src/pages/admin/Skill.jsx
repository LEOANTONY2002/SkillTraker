import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Axios } from "../../axios";
import { getSkills } from "../../redux/slices/adminSlice";
import "./Category.css";
import "./Skill.css";

function Category() {
  const { categories, skills } = useSelector((state) => state.admin);
  const [add, setAdd] = useState({
    skill: "",
    category: "",
  });
  const [edit, setEdit] = useState({
    open: false,
    skill: "",
    newSkill: "",
    category: "",
    newCategory: "",
  });
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const dispatch = useDispatch();

  console.log(categories);

  const addSkill = async () => {
    (add.category === "") | (add.skill === "") &&
      setErr({
        open: true,
        msg: "Check the fields - Skill and category!",
      });
    const { data } = await Axios.post("/admin/skill", {
      name: add.skill,
      category: add.category,
    });
    dispatch(getSkills(data));
    setAdd({
      skill: "",
      category: "",
    });
  };

  const updateSkill = async () => {
    const { data } = await Axios.put("/admin/skill", {
      name: edit.skill,
      newName: edit.newSkill,
      category: edit.newCategory,
    });
    dispatch(getSkills(data));
    setEdit({ open: false });
  };

  const deleteSkill = async (cat) => {
    const { data } = await Axios.delete(`/admin/skill/${cat}`);
    dispatch(getSkills(data));
    setEdit({ open: false });
  };

  return (
    <>
      <div className="category">
        <div className="c-add">
          <p>Add Skill</p>
          <div className="ca-inp">
            <input
              type="text"
              placeholder="New Skill"
              value={add.skill}
              onChange={(e) => setAdd({ ...add, skill: e.target.value })}
            />
            <img
              onClick={() => addSkill()}
              src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png"
              alt=""
            />
          </div>
          <div style={{ maxWidth: "100%" }} className="ce-cat">
            {categories.map((c) => (
              <span
                style={
                  c._id === add.category
                    ? { backgroundColor: "#fc3737", color: "white" }
                    : {}
                }
                onClick={() => setAdd({ ...add, category: c._id })}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
        <div className="c-list">
          {skills &&
            skills.map((c) => (
              <div className="sl-skill">
                <div className="sl-head">
                  <img
                    src="https://img.icons8.com/fluency-systems-filled/48/ffffff/light-on--v1.png"
                    alt=""
                  />
                  <div>
                    <p>{c.name}</p>
                    <img
                      onClick={() =>
                        setEdit({
                          open: true,
                          skill: c.name,
                          newSkill: c.name,
                          category: c.category._id,
                          newCategory: c.category._id,
                        })
                      }
                      src="https://img.icons8.com/fluency-systems-regular/48/fc3737/pencil.png"
                      alt=""
                    />
                    <img
                      onClick={() => deleteSkill(c._id)}
                      src="https://img.icons8.com/fluency-systems-regular/48/fc3737/delete.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            ))}
          {/* <p>{Object.keys(categories).length}</p> */}
        </div>
      </div>
      {edit.open && (
        <div className="c-edit">
          <div>
            <div className="ce-head">
              <img
                src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png"
                alt=""
              />
              <p>Edit Skill</p>
              <img
                onClick={() => setEdit({ open: false })}
                src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                alt=""
              />
            </div>
            <div className="ce-body">
              <p>{edit.newSkill}</p>
              <input
                type="text"
                placeholder="Category"
                value={edit.newSkill}
                onChange={(e) => setEdit({ ...edit, newSkill: e.target.value })}
              />
              <div className="ce-cat">
                {categories.map((c) => (
                  <span
                    style={
                      c._id === edit.newCategory
                        ? { backgroundColor: "#fc3737", color: "white" }
                        : {}
                    }
                    onClick={() => setEdit({ ...edit, newCategory: c._id })}
                  >
                    {c.name}
                  </span>
                ))}
              </div>
              <button onClick={() => updateSkill()}>Update</button>
            </div>
          </div>
        </div>
      )}
      {err.open && (
        <div className="error">
          <img
            src="https://img.icons8.com/material-sharp/24/ffffff/error-cloud.png"
            alt=""
          />
          <p>{err.msg}</p>
          <img
            onClick={() => setErr({ open: false })}
            src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
            alt=""
          />
        </div>
      )}
    </>
  );
}

export default Category;
