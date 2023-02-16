import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Axios, BambooAxios } from "../../axios";
import Error from "../../components/Error";
import Nav from "../../components/Nav";
import { useAddEmployeeSkill } from "../../graphql/mutation/useAddEmployeeSkill";
import { useDeleteEmployeeSkill } from "../../graphql/mutation/useDeleteEmployeeSkill";
import { useGetAllSkills } from "../../graphql/query/useGetAllSkills";
import { useGetEmployee } from "../../graphql/query/useGetEmployee";
import { getUser } from "../../redux/slices/userSlice";
import "./Profile.css";

function Profile() {
  const { user, accessToken } = useSelector((state) => state.user);
  const {skills} = useGetAllSkills()
  const [userSkill, setUserSkill] = useState([]);
  const [skill, setSkill] = useState({
    open: false,
    skills: [...user?.employeeSkills],
  });
  const [err, setErr] = useState({
    open: false,
    msg: "",
  });
  const dispatch = useDispatch();
  const cancelToken = axios.CancelToken.source();
  const [shrink, setShrink] = useState(true)
  const {esAdd} = useAddEmployeeSkill()
  const {esDelete} = useDeleteEmployeeSkill()

  useEffect(() => {
    setSkill({
      ...skill,
      skills: [...user?.employeeSkills]
    })
  }, [user])


  console.log("AS", skills)
  console.log("S", skill);
  console.log("US", userSkill);


  const addSkill = async (coskillId, level) => {
    let {loading: addingES, data: addES} = await esAdd({
      variables: {
        employeeId: user?.id,
        coskillId,
        level
      }
    })
    // let { loading: gettingEmployee, data: employeeData } = await getEmployee({
    //   variables: {
    //     email: user?.email,
    //   }
    // })
    console.log("GET_EMPLOYEE", addES.addEmployeeSkill)
    dispatch(getUser(addES?.addEmployeeSkill))
  };

  const delSkill = async (eskillId) => {
    console.log(eskillId)
    let {loading: deletingES, data: employeeData} = await esDelete({
      variables: {
        eskillId,
        employeeId: user?.id,
      }
    })
    console.log("DELETE_EMPLOYEE", employeeData)
    dispatch(getUser(employeeData?.deleteEmployeeSkill))
  };

  return (
    <>
      <div className="profile">
        <div className="p-main">
          <div className="p-img">
            <img
              style={
                user.photo !== null
                  ? { padding: "0px", width: "100px", height: "100px" }
                  : { padding: "20px" }
              }
              src={
                user.photo !== null
                  ? user.photo
                  : "https://img.icons8.com/fluency-systems-regular/70/ffffff/group-background-selected.png"
              }
              alt=""
            />
          </div>
          <div className="p-title">
            <p>{user.name}</p>
            <span>{user.email}</span>
          </div>
          <div className="p-skills">
            <div className="ps-head">
              <p>Skills</p>
              <span></span>
              <img
                onClick={() => setSkill({ ...skill, open: true })}
                src="https://img.icons8.com/ios-glyphs/30/ffffff/plus-math.png"
                alt=""
              />
            </div>
            <div className="psks">
              {user.employeeSkills.length !== 0 ? (
                user.employeeSkills.map((es) => (
                  <div key={es?.skill?.skill?.id} className="psk">
                    <p>{es?.skill?.skill?.name}</p>
                    <h6></h6>
                    <span>
                      {es?.skill?.category?.name}
                    </span>
                  </div>
                ))
              ) : (
                <h6 style={{margin: "30px 0", color: "lightgray"}}>Add your skills</h6>
              )}
            </div>
          </div>
        </div>
      </div>
      {skill.open && (
        <div className="e-skill">
          <div className="s-add">
            <div style={{ width: "100%" }} className="ce-head">
              <img src="https://img.icons8.com/fluency-systems-filled/48/ffffff/light-on--v1.png" alt="" />
              <p>Edit Skill</p>
              <img
                onClick={() => {
                  setSkill({ open: false, skills: [...user?.employeeSkills] });
                }}
                src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                alt=""
              />
            </div>
            <div className="sa-body">
              <div>
                {skill?.skills.length !== 0 ?
                  skill?.skills?.map((es) => (
                    <div
                      onClick={() => delSkill(es.id)}
                      className="sab-sk"
                    >
                      <p>{es?.skill?.skill?.name}</p>
                      <span>
                        {es?.skill?.category?.name}
                      </span>
                      <h6>{es?.level}</h6>
                    </div>
                  )): (<h6 style={{margin: "30px 0", color: "lightgray"}}>Add your skills</h6>)}
              </div>
              <div>
                <p className="sel">
                  Select your skills <span></span>{" "}
                </p>
                {skills.length !== 0 &&
                  skills?.map((cos) => (
                    <div className="sab">
                      <div className="sab-sk">
                        <p>{cos?.skill?.name}</p>
                        <span>{cos?.category?.name}</span>
                      </div>
                      <section className="sab-exp">
                        <p onClick={() => addSkill(cos?.id, "MINIMAL")}>Minimal</p>
                        <p onClick={() => addSkill(cos?.id, "BEGINNER")}>Beginner</p>
                        <p onClick={() => addSkill(cos?.id, "INTERMEDIATE")}>
                          Intermediate
                        </p>
                        <p onClick={() => addSkill(cos?.id, "ADVANCED")}>Advanced</p>
                      </section>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {err.open && (
        <div className="err">
          <Error err={err} setErr={setErr} />
        </div>
      )}
      <div className="nav-menu">
        <Nav shrink={shrink} setShrink={setShrink} />
      </div>
    </>
  );
}

export default Profile;
