import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Axios } from "../../axios";
import { useAddSkill, useDeleteSkill } from "../../graphql/mutation/useSkill";
import { getSkills } from "../../redux/slices/adminSlice";
import "./Category.css";
import Nav from "./Nav";
import "./Skill.css";

function Skill() {
  const { categories, skills } = useSelector((state) => state.admin);
  const [skill, setSkill] = useState({
    open: false,
    id: "",
    name: "",
    categoryId: "",
  });
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const dispatch = useDispatch();
  const {addSkill} = useAddSkill()
  const {deleteSkill} = useDeleteSkill()

  console.log(skills);

  const addNewSkill = async () => {
    (skill.name === "") | (skill.categoryId === "") &&
      setErr({
        open: true,
        msg: "Check the fields - Skill and Category!",
      });
    const { data } = await addSkill({variables: skill})
    dispatch(getSkills(data.addSkill));
    setSkill({
      open: false,
      id: "",
      name: "",
      categoryId: ""
    });
  };


  const delSkill = async (coskillId, id) => {
    const { data } = await deleteSkill({variables: {coskillId, id}})
    dispatch(getSkills(data.deleteSkill));
    setSkill({
      open: false,
      id: "",
      name: "",
      categoryId: "",
    });
  };

  return (
    <>
      <div className="category">
        <div className="c-add">
          <p>Add Skill</p>
          <div className="ca-main">
            <div className="ca-inp">
              <input
                type="text"
                placeholder="New Skill"
                value={skill.name}
                onChange={(e) => setSkill({ ...skill, name: e.target.value })}
              />
              <img
                onClick={() => addNewSkill()}
                src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png"
                alt=""
              />
            </div>
            <div className="ce-cat">
              {categories.map((c) => (
                <span
                  style={
                    c.id === skill.categoryId
                      ? { backgroundColor: "#fc3737", color: "white" }
                      : {}
                  }
                  onClick={() => setSkill({ ...skill, categoryId: c.id })}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="c-list">
          {skills &&
            skills.map((s) => (
              <div className="sl-skill">
                <div className="sl-head">
                  <img
                    src="https://img.icons8.com/fluency-systems-filled/48/ffffff/light-on--v1.png"
                    alt=""
                  />
                  <div>
                    <p>{s?.skill?.name}</p>
                    <img
                      onClick={() =>
                        setSkill({
                          open: true,
                          id: s?.id,
                          name: s?.skill?.name,
                          categoryId: s?.skill?.category.id,
                        })
                      }
                      src="https://img.icons8.com/fluency-systems-regular/48/fc3737/pencil.png"
                      alt=""
                    />
                    <img
                      onClick={() => delSkill(s.id, s?.skill?.id)}
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
      {skill.open && (
        <div className="c-edit">
          <div>
            <div className="ce-head">
              <img
                src="https://img.icons8.com/fluency-systems-filled/48/ffffff/category.png"
                alt=""
              />
              <p>Edit Skill</p>
              <img
                onClick={() => setSkill({ open: false, id: "", name: "", categoryId: "" })}
                src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                alt=""
              />
            </div>
            <div className="ce-body">
              <p>{skill.name}</p>
              <input
                type="text"
                placeholder="Category"
                value={skill.name}
                onChange={(e) => setSkill({ ...skill, name: e.target.value })}
              />
              <div className="ce-cat">
                {categories.map((c) => (
                  <span
                    style={
                      c.id === skill.categoryId
                        ? { backgroundColor: "#fc3737", color: "white" }
                        : {}
                    }
                    onClick={() => setSkill({ ...skill, categoryId: c.id })}
                  >
                    {c.name}
                  </span>
                ))}
              </div>
              <button onClick={() => addNewSkill()}>Update</button>
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

      <Nav />
    </>
  );
}

export default Skill;
