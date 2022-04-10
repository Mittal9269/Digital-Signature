import React from 'react';
import {Navigate} from "react-router-dom";
import { useCookies } from 'react-cookie';

export default function Logout(){

    const [,  , removeCookie] = useCookies(['user']);
    return (
        <>
            {sessionStorage.clear()}
            {removeCookie('jwttoken')}
            <Navigate to="/" />
        </>
    
    )
}