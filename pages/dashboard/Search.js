import React, { useState, useEffect, useContext } from 'react';
import Calendar from '../../components/items/Calendar';
import Side_Calendar from '../../components/items/Side_Calendar';
import Community from '../../components/previews/Community';
import Event from '../../components/previews/Event';
import Invite from '../../components/previews/Invite';
import Side_Preview from '../../components/previews/Side';
import { Content, Header, List, Main, Menu, Section, Side } from '../../components/wrappers/Wrappers';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { get_events } from '../../firebase/methods/Event_Functions';
import { get_groups } from '../../firebase/methods/Group_Functions';
import { event_preview_array_format } from '../../tools/DateTime_Methods';
import { Column } from '../../tools/global_components';
import { format_events } from '../../tools/Global_Functions';

function Search() {
    const { user_profile } = useContext(ProfileDataContext);
    const [selected, set_selected] = useState(0);
    const [selected_groups, set_selected_groups] = useState(0)
    const [hide_communities, set_hide_communities] = useState(true);
    const [events, set_events] = useState([]);
    const [groups, set_groups] = useState([]);

    useEffect(() => {
        const fetch_data = async () => {
            const events = await get_events();
            set_events(events.filter(item => !item.private))
            const groups = await get_groups();
            set_groups(groups.filter(item => item.type !== 0));
        }
        fetch_data();
    }, [])

    const menu = ["All", "Charity", "Community", "Business"];
    const _events = [ 
        <List height={43} padding={1.5}>{events.map((item, index) => <Event  data={item} index={index} delay={1} />)}</List>,  
        <List height={43} padding={1.5}>{events.filter(item => item.organiser.type === 1).map((item, index) => <Event  data={item} index={index} />)}</List>,  
        <List height={43} padding={1.5}>{events.filter(item => item.organiser.type === 2).map((item, index) => <Event  data={item} index={index} />)}</List>,  
        <List height={43} padding={1.5}>{events.filter(item => item.organiser.type === 3).map((item, index) => <Event  data={item} index={index} />)}</List>,  
    ];

    const _groups = [ 
        <List height={28} state={hide_communities}>{groups.map((item, index) => <Community data={item} index={index} />)}</List>,  
        <List height={28} state={hide_communities}>{groups.filter(item => item.type === 1).map((item, index) => <Community data={item} index={index} />)}</List>,  
        <List height={28} state={hide_communities}>{groups.filter(item => item.type === 2).map((item, index) => <Community data={item} index={index} />)}</List>,  
        <List height={28} state={hide_communities}>{groups.filter(item => item.type === 3).map((item, index) => <Community data={item} index={index} />)}</List>,  
    ];

    console.log(events)


    return (
        <Main>
            <Content>
                <Section>
                    <Header state={hide_communities} action={set_hide_communities}>Public Communities</Header>
                    <Menu selected={selected_groups} select={set_selected_groups} padding={1}>{menu}</Menu>
                    {_groups[selected_groups]}
                </Section>
                <Section>
                    <Header delay={1}>Open Events</Header>
                    <Menu selected={selected} select={set_selected} delay={1}>{menu}</Menu>
                    {_events[selected]}
                </Section>
            </Content>
            <Side>
               <Side_Calendar>My Schedule</Side_Calendar>
            </Side>
        </Main>
    )
}

export default Search;