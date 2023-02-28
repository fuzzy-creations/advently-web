import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/Auth.context';
import { Redirect } from 'react-router';

function LogOut(){
    const { sign_out } = useContext(AuthContext);
    const [status, setStatus] = useState(false);
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        sign_out().then(setStatus(true))
    }, [])

    if(redirect){return <Redirect to="/" />}

    if(status){
        setTimeout(() => {
            setRedirect(true)
        }, 3000)    
    }


    return (
            
        <div>
           { status ? <h1>Sucessfully logged out</h1> : <h1>Logging out...</h1>}
        </div>
    )
}

export default LogOut;