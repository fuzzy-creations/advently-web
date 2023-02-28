import React, { useState, useEffect, useContext } from 'react';
import { Column, ColumnCentered, ColumnSpaced, form_info, Row, RowSpaced } from '../../tools/global_components';
import styles from '../../styles/components/screens/Profile.module.scss';
import { get_users_communities, get_users_history, get_users_upcoming, get_user_data } from '../../firebase/methods/User_Functions';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Loader from '../UI/Loader';
import { SideRight, SideUp } from '../wrappers/Animations';
import Pressable from '../items/Pressable';
import User_Action_Button from '../buttons/User_Action_Button';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackSharp, IoChatbubbleOutline, IoLockClosedOutline } from "react-icons/io5";
import Icon from '../UI/Icon';
import { AuthContext } from '../../contexts/Auth.context';
import { get_chat_id } from '../../tools/Global_Functions';
import { create_chat } from '../../firebase/methods/Message_Functions';



function Profile(props) {
    const { user } = useContext(AuthContext);
    const { user_profile } = useContext(ProfileDataContext);
    const data = props.data;
    const chat_id = get_chat_id(user_profile.id, data.id)

    const [groups, set_groups] = useState([]);
    const [events, set_events] = useState([]);
    const [history, set_history] = useState([]);
    const [friends, set_friends] = useState([]);
    const [message_input, set_message_input] = useState("");
    const [selected, set_selected] = useState(0);
    const navigate = useNavigate();

    const access = data.private === false ? true : data.friends.includes(user) ? true : false;

    console.log(data)


    useEffect(() => {
        const fetch = async () => {
            const g = await get_users_communities(data.id);
            set_groups(g);
            const e = await get_users_upcoming(data.id);
            set_events(e);
            const f = await Promise.all(data.friends.map(async (item) => await get_user_data(item)));
            set_friends(f);
            const h = await get_users_history(data.id);
            set_history(h);
        };
        fetch();
    }, []);



    const _details = (
        <Column fixed={true} gap={0}>
             <Column gap={1.5} fixed={true} padding={2} height={"12rem"}>
                <p class="bold">About</p>
                <p class="medium">{data.about.length === 0 ? "" : data.about}</p>
            </Column>
            {access ? (
                <>
                <section className={styles.selector} onClick={() => set_selected(1)}>
                    <SideUp><p class="bold">Recent Activity</p></SideUp>
                    <Row gap={1}>{events.slice(0, 9).length === 0 ? "" : events.map(item => <Item image={item.image} />)}</Row>
                    {events.length > 9 ? <SideRight index={0} delay={1.5}><div className={styles.item}><p>{events.length}</p></div></SideRight> : null}
                </section>
                <section className={styles.selector} onClick={() => set_selected(2)}>
                    <SideUp index={0} delay={0.5}><p class="bold">Communities</p></SideUp>
                    <Row gap={1}>{groups.slice(0, 9).map(item => <Item delay={0.5} image={item.image} />)}</Row>
                    {groups.length > 9 ? <SideRight index={0} delay={1.5}><div className={styles.item}><p>{groups.length}</p></div></SideRight> : null}
                </section>
                <section className={styles.selector} onClick={() => set_selected(3)}>
                    <SideUp index={0} delay={1}><p class="bold">Friends</p></SideUp>
                    <Row gap={1}>
                        {friends.slice(0, 9).map(item => <Item delay={1} image={item.image} />)}
                        {friends.length > 9 ? <SideRight index={0} delay={1.5}><div className={styles.item}><p>{friends.length}</p></div></SideRight> : null}
                    </Row>
                </section>
                </>
            ) : (
                <section className={styles.private}>
                    <div className={styles.private__wrapper}>
                        <IoLockClosedOutline />
                        <h4 class="medium">Private</h4>
                        <p class="light">This account is private, join their friends to see their profile.</p>
                    </div>
                </section>
            )}
        </Column>
    );

    const _events = (
        <Column gap={2}>
            <Row gap={1}> 
                <Icon action={() => set_selected(0)} medium={true}><IoChevronBackSharp /></Icon>
                <h4>Recent Activity</h4>
            </Row>
            <Column gap={2}>
                <Column gap={2} fixed={true}>
                    <p class="bold">Upcoming Activity</p>
                    <Row gap={1}>{events.length === 0 ? "" : events.map(item => <Large_Item id={item.id} url={"event"} name={item.name} image={item.image} />)}</Row>
                </Column>
                <Column gap={2} fixed={true}>
                    <p class="bold">Past Activity</p>
                    <Row gap={1}>{history.length === 0 ? "" : history.map(item => <Large_Item id={item.id} url={"event"} name={item.name} image={item.image} />)}</Row>
                </Column>
            </Column>
        </Column>
    )

    const _groups = (
        <Column gap={2}>
            <Row gap={1}> 
                <Icon action={() => set_selected(0)} medium={true}><IoChevronBackSharp /></Icon>
                <h4>Communities</h4>
            </Row>
            <Column gap={2}>
                <Column gap={2} fixed={true}>
                    <p class="bold">Organiser</p>
                    <Row gap={1}>{groups.filter.length === 0 ? "" : groups.filter(item => item.admin === user).map(item => <Large_Item id={item.id} url={"/community"} name={item.name} image={item.image} />)}</Row>
                </Column>
                <Column gap={2} fixed={true}>
                    <p class="bold">Member</p>
                    <Row gap={1}>{groups.length === 0 ? "" : groups.filter(item => item.admin !== user).map(item => <Large_Item id={item.id} url={"/community"} name={item.name} image={item.image} />)}</Row>
                </Column>
            </Column>
        </Column>
    );

    const _friends = (
        <Column gap={2}>
            <Row gap={1}> 
                <Icon action={() => set_selected(0)} medium={true}><IoChevronBackSharp /></Icon>
                <h4>Friends</h4>
            </Row>
            <Row gap={1}>{friends.length === 0 ? "" : friends.map(item => <Large_Item name={item.name} image={item.image} />)}</Row>
        </Column>
    );



    const content = [_details, _events, _groups, _friends]

    return (
        <main className={styles.profile}>
            <Column>
                <section className={styles.header}>
                    <img className={styles.image} src={data.image} />
                    <Column gap={1.5} fixed={true}>
                        <Column fixed={true} gap={0.5}>
                            <h3 class="bold">{data.name}</h3>
                            <p class="medium">{data.location}</p>
                        </Column>
                        <Row gap={2}>
                            <Row gap={0.7}><p class="bold">{data.friends.length}</p><p class="medium">{data.friends.length === 1 ? "Friend" : "Friends"}</p></Row>
                            <Row gap={0.7}><p class="bold">{groups.length}</p><p class="medium">{groups.length === 1 ? "Community" : "Communities"}</p></Row>
                        </Row>
                        <div className={styles.actions}>
                            <User_Action_Button user_data={data} />
                            {access ? <Icon medium={true} action={() => navigate('/messages', { state: data })}><IoChatbubbleOutline /></Icon> : null}
                        </div>
                    </Column>
                </section>
                {/* <section>
                    {form_info("Has requested")}
                </section> */}
                {content[selected]}
            </Column>

           
        </main>
    )
}

export default Profile;


const Item  = (props) => {
    return (
        <SideUp index={0} delay={props.delay}>
            <div className={styles.item}>
                <img className={styles.item__image} src={props.image} />
            </div>
        </SideUp>
    )
};

const Large_Item  = (props) => {
    return props.url ? (
        <Link to={`${props.url}/${props.id}`} className={styles.large_item}>
            <img className={styles.large_item__image} src={props.image} />
            <small class="medium_dark">{props.name}</small>
        </Link>
    ) : (
        <div className={styles.large_item}>
            <img className={styles.large_item__image} src={props.image} />
            <small class="medium_dark">{props.name}</small>
        </div>
    )
};

