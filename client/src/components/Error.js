import React, { memo } from 'react'

function Error({ err, setErr }) {

    if (err.open) return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", width: "100vw" }}>
            <div className="error">
                <img src="https://img.icons8.com/material-sharp/24/ffffff/error-cloud.png" />
                <p>{err.msg}</p>
                <img onClick={() => setErr({ open: false })} src="https://img.icons8.com/ios/48/fc3737/delete-sign--v1.png" />
            </div>
        </div>
    )


}

export default memo(Error)