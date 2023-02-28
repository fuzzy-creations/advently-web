import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Event_Action_Button from '../../components/buttons/Event_Action_Button';
import User from '../../components/previews/User';
import Loader from '../../components/UI/Loader';
import Missing from '../../components/UI/Missing';
import { Content, FlexList, Header, List, Main, Section, Side } from '../../components/wrappers/Wrappers';
import { AuthContext } from '../../contexts/Auth.context';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import styles from '../../styles/pages/dashboard/Event.module.scss';
import { event_expired, event_format } from '../../tools/DateTime_Methods';
import { listenRealTimeComments, listenRealTimeEvent } from '../../tools/Fetches';
import { Column, form_info, Row, RowSpaced } from '../../tools/global_components';
import Send_Message from '../../components/items/Send_Message';
import Message from '../../components/items/Message';
import { group_types } from '../../tools/Global_Variables';
import generatePushID from '../../tools/IDGenerator';
import { add_event_comment } from '../../firebase/methods/Event_Functions';
import { Private } from '../../components/wrappers/Empty';
import Pressable from '../../components/items/Pressable';
import Edit_Event from '../../components/screens/Edit_Event';
import Button_Main from '../../components/buttons/Button_Main';
import { RiEditCircleLine } from "react-icons/ri";
import Icon from '../../components/UI/Icon';

function Event (props) {
    const params = useParams()
    const location = useLocation()
    const data = location.state
    const event_id = params.id;
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext);
    const [event_data, set_event_data] = useState(data ? data : null);
    const [comments, set_comments] = useState([]);
    const [loader, set_loader] = useState(data ? false : true);
    const [hide_members, set_hide_members] = useState(true);
    const [message_input, set_message_input] = useState("");


    useEffect(() => {
        const fetch_data = async () => {
            if(event_id) {
                const unlistenEvent = listenRealTimeEvent(set_event_data, event_id);
                const unlistenComments = listenRealTimeComments(set_comments, event_id);
                set_loader(false);
                return () => {
                    unlistenEvent();
                    unlistenComments();
                };
            } 
        }
        fetch_data();
        
    }, [event_id])

    var access_level = 0;

    if(event_data === null) { return <Loader />  }
    if(!event_data.id) { return <Missing /> }

    const access_level_handler = () => {
        if(event_data.admin === user) return 3
        if(event_data.mods.includes(user)) return 2
        if(event_data.invites.includes(user)) return 1
        if(event_data.members.includes(user)) return 1
        if(event_data.private_status === false) return 1
        return 0
    };

    access_level = access_level_handler();

    const expired = event_expired(event_data.start);
    const full = event_data.members.length >= event_data.slots;

    const message_handler = async () => {
        const message_id = generatePushID();
        const status = await add_event_comment(event_data.id, event_data.name, user_profile, message_id, message_input);
        if(status === true) { set_message_input(""); };
    }


    return (
        <Main>
            <Content>
                <Column gap={2} fixed={true}>
                    <RowSpaced>
                        <Column gap={1} fixed={true}>
                            <Row gap={1}>
                                <h1>{event_data.name}</h1>
                                {access_level >= 2 ? <Pressable content={<Edit_Event data={event_data} />}><Icon light={true}><RiEditCircleLine /></Icon></Pressable> : null}
                            </Row>
                            <Link to={`/${event_data.group_id ? "community" : "user"}/${event_data.organiser.id}`} state={event_data.organiser} params={{data: event_data.organiser}}><h4 className={'primary'}>{event_data.organiser.name}</h4></Link>
                        </Column>
                        <h2>{event_format(event_data.start)}, {event_data.time}</h2>
                    </RowSpaced>
                    <RowSpaced>
                        <Row gap={2}>
                            <p className={styles.highlight}>{event_data.private_status ? "Private" : "Public" || null}</p>
                            <p className={styles.highlight}>{event_data.slots - event_data.members.length} Available Places</p>
                        </Row>
                        <span style={{width: "34rem"}}>{expired ? form_info("This event has finished.") : full && !event_data.members.includes(user) ? form_info("This event is full.") : <Event_Action_Button data={event_data} />}</span>
                    </RowSpaced>
                    <img className={styles.image} src={event_data.image} />
                </Column>
                <Section>
                    <Header>Location</Header>
                    <p className={styles.text}>{access_level === 0 ? event_data.location.split(",")[1] : event_data.location}</p>
                </Section>
                {access_level === 0 ? null : (
                <Section>
                    <Header state={hide_members} action={set_hide_members}>Going</Header>
                    <FlexList state={hide_members} height={19}>
                        {event_data.members.map((item, index) => <User id={item} index={index} />)}
                        <h2 style={{width: "100%"}}>Invited</h2>
                        {event_data.invites.map((item, index) => <User id={item} index={index} />)}
                    </FlexList>
                </Section>
                )}
                {access_level === 0 ? null : (
                <Section>
                    <Header>Details</Header>
                    <div className={styles.details}>{event_data.details.split('\n').map((item, key) => <p className={styles.text} key={key}>{item}{"\n"}</p>)}</div>
                </Section>
                )}
                    
            </Content>
            <Side>
                <Private message="Join this Event to see it's discussion and details." access={access_level > 0}>
                    <h2>Discussion</h2>
                    <section className={styles.messages}>{comments.map((message, index) => <Message data={message} user={message.data} sender={message.ref_id === user} key={index} /> ).reverse()}</section>
                    <section className={styles.action}><Send_Message valid={true} value={message_input} input={set_message_input} action={() => message_handler()}>Enter something</Send_Message></section>
                </Private>
            </Side>
        </Main>
    )
}

export default Event