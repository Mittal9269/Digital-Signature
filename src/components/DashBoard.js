import React, { useEffect , useState } from "react";
import GoogleLogin from "react-google-login";
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';


export default function DashBorad() {

    const [cookies, setCookie] = useCookies(['user']);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!cookies.jwttoken) {}
        else { setRedirect(true); }
    }, [])

    const responseSuccessGoogle = (response) => {
        // console.log(response.profileObj);
        const email = response.profileObj.email
        if(email.slice(-12) === "@iitdh.ac.in"){
            
            if(response.profileObj.googleId !== null){
                // sessionStorage.setItem('key', );
                setCookie('jwttoken', response.profileObj.googleId, {
                    path: '/', 
                    expires: new Date(Date.now() + 48 * 360000)
                })
                    window.location.reload();
            }
            else{
                if (!alert('Error while saving please try later!')) { window.location.reload(); }
            }
        }
        else{
            if (!alert('Please login with iitdh ID!')) { window.location.reload(); }
        }
    }
    const responseErrorGoogle = (response) => {
        console.log(response)
        if (!alert('Error while login please try later!')) { window.location.reload(); }
    }


    return (
        <>
            {redirect && <Navigate to="/app" />}
            <div className="container-fluid mt-5 text-center">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
                        <div className="content">
                            <p>&nbsp;</p>

                            <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: '512px' }}>
                                <h2 className="text-white text monospace bg-dark"><b><ins>LOGIN</ins></b></h2>
                                <GoogleLogin
                                    clientId={process.env.REACT_APP_CLIENTID}
                                    buttonText="Login"
                                    onSuccess={responseSuccessGoogle}
                                    onFailure={responseErrorGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>

                            <p>&nbsp;</p>

                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}