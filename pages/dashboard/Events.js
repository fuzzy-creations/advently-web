import React, { useState, useEffect, useContext, useRef } from 'react';
import Calendar from '../../components/items/Calendar';
import Event from '../../components/previews/Event';
import Invite from '../../components/previews/Invite';
import Side_Preview from '../../components/previews/Side';
import { Content, Header, List, Main, Menu, Section, Side } from '../../components/wrappers/Wrappers';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { date_after, event_preview_array_format } from '../../tools/DateTime_Methods';
import { Column, Row } from '../../tools/global_components';
import { format_events } from '../../tools/Global_Functions';
import moment from 'moment';
import Side_Calendar from '../../components/items/Side_Calendar';
import generatePushID from '../../tools/IDGenerator';
import Pressable from '../../components/items/Pressable';
import Create_Event from '../../components/screens/Create_Event';
import Icon from '../../components/UI/Icon';
import { IoAddCircleOutline } from "react-icons/io5";
import { SideRight } from '../../components/wrappers/Animations';

function Events() {
    const { upcoming, history, user_profile, einvites } = useContext(ProfileDataContext);
    const [selected, set_selected] = useState(0);
    const [hide_invites, set_hide_invites] = useState(true);

    const menu = ["Upcoming", "History", "Saved"];
    const lists = [ 
        <List height={43} padding={1.5}>{upcoming.map((item, index) => <Event key={item.id + index} data={item} index={index} delay={1} />)}</List>,  
        <List height={43} padding={1.5}>{history.map((item, index) => <Event key={item.id + index} data={item} index={index} />)}</List>,  
        <List height={43} padding={1.5}>{user_profile.saved.map((item, index) => <Event key={item.id + index} data={item} index={index} />)}</List>
    ];

    return (
        <Main>
            <Content>
                {einvites.length === 0 ? null : (         
                <Section>
                    <Header state={hide_invites} action={einvites.length > 4 ? set_hide_invites : null}>Invites</Header>
                    <List height={25} state={hide_invites}>{einvites.map((item, index) => <Invite key={item.id + index} data={item} index={index} />)}</List>
                </Section>)
                }
                <Section>
                    <Row gap={1}><Header delay={1}>Events</Header><Pressable content={<Create_Event />}><SideRight index={0} delay={2.1}><Icon light={true}><IoAddCircleOutline /></Icon></SideRight></Pressable></Row>
                    <Menu selected={selected} select={set_selected} delay={1}>{menu}</Menu>
                    {lists[selected]}
                </Section>
            </Content>
            <Side>
               <Side_Calendar>My Schedule</Side_Calendar>
            </Side>
        </Main>
    )
}

export default Events;