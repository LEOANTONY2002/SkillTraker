import React, { memo } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllEmployees } from "../../graphql/query/useGetAllEmployees";
import "./Employee.css";
import Nav from "./Nav";

function Employee() {
  const [profile, setProfile] = useState({
    open: false,
    employee: [],
  });
  const [zoom, setZoom] = useState({
    open: false,
    cert: {}
  });
  // const {loading: gettingEmployees, employees: employees=[], error: errorEmployees} = useGetAllEmployees()
  const {employees} = useSelector(state => state.admin)

  console.log(employees)

  const cat = (es) => {
    let ct = {};
    es.map((s) => {
      if (ct.hasOwnProperty(s?.skill?.category?.name))
        ct[s?.skill?.category?.name] += 1;
      else ct[s?.skill?.category?.name] = 1;
    });
    return Object.keys(ct).length;
  };

  return (
    <>
    <div className="employee">
      <h4>Employees</h4>
      <div className="e-main">
        {employees &&
          employees.map((e) => {
            if (e?.email !== "admin@changecx.com")
              return (
                <div className="emp">
                  <div className="e-head">
                    <img
                      style={
                        e?.photo !== ""
                          ? { padding: "0px", width: "50px", height: "50px" }
                          : { padding: "10px" }
                      }
                      src={
                        e?.photo !== ""
                          ? e?.photo
                          : "https://img.icons8.com/fluency-systems-filled/70/fc3737/collaborator-male?.png"
                      }
                      alt=""
                    />
                    <div className="e-title">
                      <div>
                        <p>{e?.name}</p>
                        <span>{e?.email}</span>
                      </div>
                      <img
                        onClick={() => setProfile({ open: true, employee: e })}
                        src="https://img.icons8.com/fluency-systems-filled/30/ffffff/forward.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="e-body">
                    <p>{cat(e?.employeeSkills)}</p>
                    <span>Categories</span>
                    <p>{e?.employeeSkills?.length}</p>
                    <span>Skills</span>
                  </div>
                </div>
              );
          })}
      </div>

      {profile?.open && (
        <div className="u-prof">
          <div>
            <img
              onClick={() => {
                setProfile({ open: false, employee: [] });
              }}
              src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
              alt=""
            />
            <div className="up-main">
              <div className="up-head">
                <div>
                  <img
                    style={
                      profile?.employee?.photo !== ""
                        ? { padding: "0px", width: "120px", height: "120px" }
                        : { padding: "20px" }
                    }
                    src={
                      profile?.employee?.photo !== ""
                        ? profile?.employee?.photo
                        : "https://img.icons8.com/fluency-systems-filled/100/ffffff/collaborator-male.png"
                    }
                    alt=""
                  />
                </div>
                <p></p>
              </div>
              <div className="up-title">
                <p>{profile?.employee?.name}</p>
                <span>{profile?.employee?.email}</span>
              </div>
            </div>
            <div className="up-body">
              {profile?.employee?.employeeSkills.map((es) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="eb-skill">
                    <div className="ebs-head">
                      <img
                        src="https://img.icons8.com/fluency-systems-filled/48/fc3737/light-on--v1.png"
                        alt=""
                      />
                      <div>
                        <p>{es?.skill?.skill?.name}</p>
                        <span>{es?.skill?.category?.name}</span>
                      </div>
                    </div>
                    <h5
                      style={{color: "red"}}
                    >
                      {es?.level}
                    </h5>
                    <h6>{es?.updatedAt?.split("T")[0]}</h6>
                  </div>
                  {es?.certificate && (
                    <div className="s-cert">
                      <span></span>
                      <div onClick={() => setZoom({ open: true, cert: es?.certificate })}>
                        <img src={es?.certificate?.photo} alt="" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {zoom.open && (
        <div className="zoom">
          <img
            onClick={() => {
              setZoom({ open: false, cert: {} });
            }}
            src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
            alt=""
          />
          <div className="z-cert">
            <div className="zc-title">
              <p>{zoom.cert?.name}</p>
              <span>{zoom.cert?.publisher}</span>
            </div>
            <img src={zoom.cert?.photo} alt="" />
            <div className="zc-exp">
              <p>expiry</p>
              <span>{zoom.cert?.expiry}</span>
            </div>
          </div>
        </div>
      )}
    </div>

    <Nav />
    </>
  );
}

export default memo(Employee);
