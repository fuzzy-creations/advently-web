import React, { useState, useEffect, useContext } from 'react';
import styles from '../../styles/pages/dashboard/Community.module.scss';
import { AuthContext } from '../../contexts/Auth.context';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { get_group_upcoming, get_group_history, get_group_data, add_message, get_group_events, remove_member } from '../../firebase/methods/Group_Functions';
import Loader from '../../components/UI/Loader';
import Missing from '../../components/UI/Missing';
import { listenRealTimeGroup, listenRealTimeMessages } from '../../tools/Fetches';
import { useLocation, useParams } from 'react-router';
import User from '../../components/previews/User';
import { Content, FlexList, Header, List, Main, Menu, Section, Side } from '../../components/wrappers/Wrappers';
import Event from '../../components/previews/Event';
import Send_Message from '../../components/items/Send_Message';
import Message from '../../components/items/Message';
import { Column, Row, RowSpaced } from '../../tools/global_components';
import Group_Action_Button from '../../components/buttons/Group_Action_Button';
import { group_types } from '../../tools/Global_Variables';
import { IoArrowForwardSharp, IoLocationOutline } from "react-icons/io5";
import { FaLocationArrow } from "react-icons/fa";
import generatePushID from '../../tools/IDGenerator';
import Pressable from '../../components/items/Pressable';
import Profile from '../../components/screens/Profile';
import { get_user_data } from '../../firebase/methods/User_Functions';
import { Private } from '../../components/wrappers/Empty';
import Edit_Community from '../../components/screens/Edit_Community';
import Icon from '../../components/UI/Icon';
import { RiEditCircleLine } from "react-icons/ri";
import Button_Main from '../../components/buttons/Button_Main';



function Community(props){
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext);
    const params = useParams()
    const location = useLocation()
    const group_id = params.id;
    const [group_data, set_group_data] = useState(location.state || null);
    const [groups_events, set_groups_events] = useState(location.state ? location.state.upcoming : []);
    const [groups_history, set_groups_history] = useState([])
    const [groups_messages, set_groups_messages] = useState([]);
    const [loader, set_loader] = useState(location.state ? false : true);
    const [selected, set_selected] = useState(0);
    const [hide_members, set_hide_members] = useState(true);
    const [message_input, set_message_input] = useState("");
 
    useEffect(() => {
        const fetch_data = async () => {
            if(group_id) {
                const unlistenGroup = listenRealTimeGroup(set_group_data, group_id);
                const unlistenMessages = listenRealTimeMessages(set_groups_messages, group_id);
                const upcoming = await get_group_upcoming(group_id);
                const history = await get_group_history(group_id);
                set_groups_events(upcoming)
                set_groups_history(history.reverse())
                set_loader(false);
                return () => {
                    unlistenGroup();
                    unlistenMessages();
                };
            } 
        }
        fetch_data();
        
    }, [group_id])

    if(group_data === null) { return <Loader />  }
    if(!group_data.id) { return <Missing /> }

    const access_level = group_data?.admin === user ? 4 : group_data?.mods.includes(user) ? 3 : group_data?.members.includes(user) ? 2 : group_data?.invites.includes(user) ? 1 : 0;


    const menu = ["Upcoming", "History"];
    const lists = [ 
        <List height={43} padding={1.5}>{groups_events.map((item, index) => <Event key={item.id} data={{...item, organiser: group_data}} index={index} delay={1} />)}</List>,  
        <List height={43} padding={1.5}>{groups_history.map((item, index) => <Event key={item.id} data={{...item, organiser: group_data}} index={index} />)}</List>,  
    ];


    const message_handler = async () => {
        const message_id = generatePushID();
        const status = await add_message(group_data.id, group_data.name, user_profile, message_id, message_input);
        if(status === true) { set_message_input(""); };
    };

    const remove_handler = (id) => remove_member(id, group_data.id);


    return (
        <Main>
            <Content>
                
                <section className={styles.header}>
                    <div className={styles.header__content}>
                        <Column gap={1} fixed>
                            <Row gap={2}>
                                <small className={styles.highlight}>{group_types[group_data.type]}</small>
                                <small>{group_data.members.length} members</small>
                            </Row>
                            <h1 className={styles.title}>{group_data.name}</h1>
                        </Column>
                        <p className='medium'>{group_data.about}</p>
                        <Row gap={4}>
                            <Card id={group_data.admin} />
                            <div className={styles.card__divider} />
                            <div className={styles.card}>
                                <div className={styles.card__image}><FaLocationArrow /></div>
                                <Column gap={0.5} fixed>
                                    <small>Location</small>
                                    <p>{group_data.location}</p>
                                </Column>
                            </div>
                        </Row>
                        <div className={styles.header__action}>
                            {access_level === 4 ? null : <Group_Action_Button data={group_data} />}
                            {access_level >= 3 ? <Pressable content={<Edit_Community data={group_data} />}><Icon><RiEditCircleLine /></Icon></Pressable> : null}
                        </div>
                    </div>
                    <img className={styles.image} src={group_data.image} />
                </section>
                {access_level === 0 ? null : (
                    <Section>
                        <Header state={hide_members} action={set_hide_members}>Members</Header>
                        <FlexList state={hide_members} height={19}>
                            {group_data.members.map((item, index) => <User id={item} index={index} action={remove_handler} />)}
                        </FlexList>
                    </Section>
                )}
                {access_level === 0 ? null : (
                <Section>
                    <Header delay={1}>Events</Header>
                    <Menu selected={selected} select={set_selected} delay={1}>{menu}</Menu>
                    {lists[selected]}
                </Section>
                 )}
            </Content>
            <Side>
                <Private message="Follow this Community to see their discussion and events." access={access_level > 0}>
                    <h2>Discussion</h2>
                    <section className={styles.messages}>{groups_messages.map((message, index) => <Message data={message} user={message.data} sender={message.ref_id === user} key={index} /> ).reverse()}</section>
                    <section className={styles.action}><Send_Message valid={true} value={message_input} input={set_message_input} action={() => message_handler()}>Enter something</Send_Message></section>
                </Private>
            </Side>
        </Main>
    )
}

export default Community;


const Card = (props) => {
    const [organiser, set_organiser] = useState({}); 
    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(props.id);
            set_organiser(u);
        }
        fetch()
    }, [])
    return (
        <div className={styles.card}>
            <Pressable content={<Profile data={organiser} />}><img className={styles.card__image} src={organiser.image} /></Pressable>
            <Column gap={0.5} fixed={true}>
                <small>Organiser</small>
                <p>{organiser.name}</p>
            </Column>
        </div>
    )
};