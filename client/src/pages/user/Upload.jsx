import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileBase64 from "react-file-base64";
import "./Upload.css";
import Nav from "../../components/Nav";
import { useAddCertificate } from "../../graphql/mutation/useAddCertificate";
import { getUser } from "../../redux/slices/userSlice";

function Upload() {
    const { user, accessToken } = useSelector((state) => state.user);
    const [cert, setCert] = useState({
        open: false,
        name: "",
        publisher: "",
        expiry: "",
        photo: "",
        employeeId: "",
        employeeSkillId: ""
    });
    const [skill, setSkill] = useState({
        open: false,
        skills: [...user.employeeSkills],
    });
    const [err, setErr] = useState({
        open: false,
        msg: ''
    })
    const dispatch = useDispatch();
    const [shrink, setShrink] = useState(true)
    const {addCertificate} = useAddCertificate()

    console.log(cert);

    

    const getFiles = (p) => {
        setCert({ ...cert, photo: p.base64 });
    };

    const upload = async () => {
        if (cert.open) {
            try {
                let {loading, data, error} = await addCertificate({
                    variables: cert
                })
                dispatch(getUser(data?.addCertificate));
                setCert({ ...cert, open: false });
            } catch (error) {
                console.log(error)
                setErr({
                    open: true,
                    msg: error.message
                })
            }
        }
    };

    return (
        <>
            <div className="upload">
                <div className="upl-main">
                    {user?.employeeSkills?.length !== 0 &&
                        user?.employeeSkills?.map((es) => (
                            <div className="u-main">
                                <div className="u-skill">
                                    <div className="us-head">
                                        <img src="https://img.icons8.com/fluency-systems-regular/48/fc3737/light-on--v1.png" alt=""/>
                                        <div>
                                            <p>{es?.skill?.skill?.name}</p>
                                            <h4></h4>
                                            <span>{es?.skill?.category?.name}</span>
                                        </div>
                                    </div>
                                    <div className="us-body">
                                        <span></span>
                                        <img
                                            onClick={es?.certificate !== null ? () => setCert({ ...cert, open: true, name: es.certificate.name, expiry: es.certificate.expiry, publisher: es.certificate.publisher, photo: es.certificate.photo, employeeSkillId: es?.id, employeeId: es.employeeId }) : () =>
                                                setCert({ ...cert, open: true, name: "", expiry: "", publisher: "", photo: "", employeeSkillId: es?.id, employeeId: es.employeeId })
                                            }
                                            src={es?.certificate !== null ? "https://img.icons8.com/fluency-systems-regular/48/ffffff/pencil.png" : "https://img.icons8.com/fluency-systems-regular/48/ffffff/upload.png"}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                {es?.certificate !== null && (
                                    <div className="u-cert">
                                        <img src={es?.certificate?.photo} alt="" />
                                    </div>
                                )}
                            </div>
                        ))}

                    {cert.open && (
                        <div className="u-upl">
                            <div className="l-body">
                                <img
                                    onClick={() => {
                                        setCert({ ...cert, open: false });
                                    }}
                                    src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png"
                                    alt=""
                                />
                                <div>
                                    <div className="lb-up">
                                        <img
                                            style={
                                                cert.photo !== ""
                                                    ? { padding: 0, width: "70px", height: "70px" }
                                                    : {}
                                            }
                                            src={
                                                cert.photo === ""
                                                    ? "https://img.icons8.com/fluency-systems-regular/72/ffffff/certificate.png"
                                                    : cert.photo
                                            }
                                            alt=""
                                        />
                                        <div>
                                            <FileBase64 onDone={getFiles.bind(this)} />
                                            <img src="https://img.icons8.com/fluency-systems-filled/25/fc3737/camera.png" alt=""/>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={cert.name}
                                    onChange={(e) => setCert({ ...cert, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Publisher"
                                    value={cert.publisher}
                                    onChange={(e) => setCert({ ...cert, publisher: e.target.value })}
                                />
                                <p
                                    style={{
                                        textAlign: "left",
                                        width: "100%",
                                        marginBottom: "-10px",
                                    }}
                                >
                                    Expiry
                                </p>
                                <input
                                    style={{
                                        textIndent: "10px",
                                        paddingRight: "10px",
                                        width: "280px",
                                    }}
                                    type="date"
                                    onChange={(e) => setCert({ ...cert, expiry: e.target.value })}
                                />
                                <button onClick={() => upload()}>Upload</button>
                            </div>
                        </div>
                    )}

                    
                </div>
            </div>
            <div className="nav-menu">
                <Nav shrink={shrink} setShrink={setShrink} />
            </div>
            
        </>
    );
}

export default Upload;
