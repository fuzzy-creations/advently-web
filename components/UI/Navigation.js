import styles from '../../styles/components/UI/Navigation.module.scss';
import Icon from './Icon';
import { VscBell } from "react-icons/vsc";
import { BsGrid } from "react-icons/bs";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { Column, Row } from '../../tools/global_components';
import { useContext, useState } from 'react';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Notification from '../items/Notification';
import Notifications from '../items/Notifications';

function Navigation () {
    const { user_profile, notifications, unread_chats, unread_notes } = useContext(ProfileDataContext);
    const [selected, set_selected] = useState(0);
    const [show, set_show] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname;
    console.log(user_profile)

    const mediaQuery = window.matchMedia('(min-width: 700px)')
    console.log(mediaQuery)

    
    return (
        <nav className={styles.nav}>
            <Row>
                <Icon selected={url === "/messages" ? true : false} badge={unread_chats === 0 ? false : true} action={() => navigate('/messages')}><IoChatbubbleOutline /></Icon>   
                <Icon selected={show} action={() => set_show(!show)} badge={unread_notes === 0 ? false : true}><VscBell /></Icon>   
            </Row>
            <section>
                <Row gap={mediaQuery.matches ? 8 : 2}>
                    <p className={`${styles.link} ${ url === "/" ? styles.link__active : null}`}><Link to={"/"}>Events</Link></p>
                    <p className={`${styles.link} ${ url === "/communities" ? styles.link__active : null}`}><Link to={"/communities"}>Communities</Link></p>
                    <p className={`${styles.link} ${ url === "/search" ? styles.link__active : null}`}><Link to={"/search"}>Search</Link></p>
                </Row>
            </section>
            <Link to="/profile" className={`${styles.profile} ${ url === "/profile" ? styles.profile__active : null}`}>
                <Row gap={2}>
                    <Column gap={0.3} fixed={true}>
                        <p class="bold">{user_profile.name}</p>
                        <small class="medium">{user_profile.friends.length} Friends</small>
                    </Column>
                    <img className={styles.avatar} src={user_profile.image} />
                </Row>
            </Link>
            {show ? <Notifications data={notifications}  set_show={set_show} /> : null}
        </nav>
    )
};

export default Navigation;