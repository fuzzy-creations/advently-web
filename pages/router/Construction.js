
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TS from '../root//TS';
import Privacy from '../root//Privacy';
import Construction from '../root/Construction';
import Contact from '../root/Contact';


function Router(){

    return (
        <Routes>
            <Route path="/" element={<Construction /> } />
            <Route path="/terms" element={<TS /> } /> 
            <Route path="/privacy" element={<Privacy /> } /> 
            <Route path="/contact" element={<Contact /> } /> 
            <Route render={() => <h1>No found</h1> } />
        </Routes>
    );

};

export default Router;