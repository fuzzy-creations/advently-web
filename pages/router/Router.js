import React, { useState, useContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth.context';
import Construction from './Construction';
import Loader_Page from '../root/Loader_Page';
import Auth from './Auth';
import Main from './Main';
import { LocationProvider } from '../../contexts/Location.context';


function Router(){
    const { user } = useContext(AuthContext);
    const [construction, set_contruction] = useState(false);

    if(construction) return <Construction /> 
    if(user === false) return <Loader_Page />


    return user ? <LocationProvider><Main /></LocationProvider> : <Auth />

};

export default Router;