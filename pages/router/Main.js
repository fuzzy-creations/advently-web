import React, { useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Error404 from '../root/Error404';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Loader_Page from '../root/Loader_Page';
import Events from '../dashboard/Events';
import Communties from '../dashboard/Communities';
import Search from '../dashboard/Search';
import Navigation from '../../components/UI/Navigation';
import Profile from '../dashboard/Profile';
import Messages from '../dashboard/Messages';
import Event from '../dashboard/Event';
import Community from '../dashboard/Community';
import Create_Community from '../../components/screens/Create_Community';
import Create_Event from '../../components/screens/Create_Event';



function Main(props) {
    const { user_profile } = useContext(ProfileDataContext);

    
    
    return user_profile ? (
        <main>
            <Navigation />
            <Routes>               
                <Route path="/" element={<Events /> } />
                <Route path="/events/create" element={<Create_Event /> } />
                <Route path="/communities" element={<Communties /> } />
                <Route path="/communities/create" element={<Create_Community /> } />
                <Route path="/search" element={<Search /> } />
                <Route path="/profile" element={<Profile /> } />
                <Route path="/messages" element={<Messages /> } />
                <Route path="/event/:id" element={<Event /> } />
                <Route path="/community/:id" element={<Community /> } />
                <Route path="*" element={<Error404 /> } />
            </Routes>
        </main>
    ) : <Loader_Page />
}

export default Main;