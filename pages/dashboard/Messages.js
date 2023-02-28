import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Chat from '../../components/items/Chat';
import Message from '../../components/previews/Message';
import User from '../../components/previews/User';
import Icon from '../../components/UI/Icon';
import { Content, FlexList, Header, List, Main, Menu, Section, Side } from '../../components/wrappers/Wrappers';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { Row } from '../../tools/global_components';
import { get_chat_id } from '../../tools/Global_Functions';
import { IoChevronBackSharp } from "react-icons/io5";
import { Empty } from '../../components/wrappers/Empty';


function Messages(props) {
    const { chats, user_profile } = useContext(ProfileDataContext);
    const { state } = useLocation();
    //const [selected, set_selected] = useState(state ? state.id : chats.length > 0 ? chats[0].contact.id : false);
    const [selected, set_selected] = useState(state ? state : false);
    const chat_ids = chats.map(chat => chat.contact.id);

    console.log(chats)
    console.log(selected)

    return (
        <Main>
            {selected ? <Chat data={selected} /> : (
            <Content>
                <Section>
                    <Header>Contacts</Header>
                    <FlexList>{user_profile.friends.filter(item => !chat_ids.includes(item)).map((item, index) => <User select={set_selected} id={item} index={index} />)}</FlexList>
                </Section>
            </Content>
            )}
        <Side>
            <h2>Messages center</h2>
            {chat_ids.includes(selected.id) || selected === false ? null : <Message data={selected} new={true} />}
            <Empty message="You have no open chats.">{chats.map((item, index) => <Message data={item} index={index} selected={selected} select={set_selected} />)}</Empty>
        </Side>
    </Main>
    )
}

export default Messages;