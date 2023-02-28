
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import TS from '../root/TS';
import Privacy from '../root/Privacy';
import Contact from '../root/Contact';
import Landing from '../auth/Landing';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Footer from '../../components/UI/Footer';
import Error404 from '../root/Error404';



function Auth(props){


    return (
        <>
        <Routes>
            <Route path="/" element={<Landing {...props} /> } />
            <Route path="/login" element={<Login /> } /> 
            <Route path="/register" element={<Register /> } />
            <Route path="/terms" element={<TS /> } /> 
            <Route path="/privacy" element={<Privacy /> } /> 
            <Route path="/contact" element={<Contact /> } /> 
            {/* SEARCH EVENT GROUP  */}
            <Route path="*" element={<Landing /> } />
        </Routes>
        <Footer />
        </>
    )

}

export default Auth;