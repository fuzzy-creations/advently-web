import React, { useState, useContext } from 'react';
import Create from '../../components/items/Create';
import Pressable from '../../components/items/Pressable';
import Side_Calendar from '../../components/items/Side_Calendar';
import Community from '../../components/previews/Community';
import Create_Community from '../../components/screens/Create_Community';
import { SideRight, SideRightModal } from '../../components/wrappers/Animations';
import { Content, Header, List, Main, Menu, Section, Side } from '../../components/wrappers/Wrappers';
import { AuthContext } from '../../contexts/Auth.context';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { IoAddCircleOutline } from "react-icons/io5";
import Icon from '../../components/UI/Icon';
import { Row } from '../../tools/global_components';


function Communities() {
    const { user } = useContext(AuthContext);
    const { groups, user_profile } = useContext(ProfileDataContext);
    const [selected, set_selected] = useState(0);
    const [hide_manage, set_hide_manage] = useState(true);
    const organiser = groups.filter(item => item.admin === user || item.mods.includes(user));


    const menu = ["All", "Charity", "Community", "Business"];
    const lists = [ 
        <List padding={1.5}>{groups.map((item, index) => <Community key={item.id + index} data={item} index={index} delay={1} />)}</List>,  
        <List padding={1.5}>{groups.filter(item => item.type === 1).map((item, index) => <Community key={item.id + index} data={item} index={index} />)}</List>,  
        <List padding={1.5}>{groups.filter(item => item.type === 2).map((item, index) => <Community key={item.id + index} data={item} index={index} />)}</List>,  
        <List padding={1.5}>{groups.filter(item => item.type === 3).map((item, index) => <Community key={item.id + index} data={item} index={index} />)}</List>
    ]


    return (
        <Main>
            <Content>
                { organiser.length === 0 ? null : (
                <Section>
                    <Header state={hide_manage} action={organiser.length > 4 ? set_hide_manage : null}>Manage</Header>
                    <List height={28} state={hide_manage}>
                        {organiser.map((item, index) => <Community key={item.id + index} data={item} index={index} />)}
                    </List>
                </Section>
                ) }
                <Section>
                    <Row gap={1}><Header delay={1}>Communities</Header><Pressable content={<Create_Community />}><SideRight index={0} delay={2.1}><Icon light={true}><IoAddCircleOutline /></Icon></SideRight></Pressable></Row>
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

export default Communities;