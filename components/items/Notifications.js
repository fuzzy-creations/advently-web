import styles from '../../styles/components/items/Notifications.module.scss';
import { FaUserPlus } from "react-icons/fa";
import { IoChevronBackSharp } from "react-icons/io5";
import { Column, Row } from '../../tools/global_components';
import { useContext, useEffect, useState } from 'react';
import Notification from './Notification';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Icon from '../UI/Icon';
import Request from './Request';
import { get_user_data } from '../../firebase/methods/User_Functions';
import { SideDown, SideLeft, SideRight, SideRightModal, SideUp } from '../wrappers/Animations';
import { Empty } from '../wrappers/Empty';

function Notifications (props) {
    // const notifications = props.data;
    const { user_profile, notifications, requests, read_notes_handler } = useContext(ProfileDataContext);
    const [selected, set_selected] = useState(0);
    const [avatar, set_avatar] = useState(null);

    useEffect(() => { 
        read_notes_handler();
        const fetch = async () => {
            const u = await get_user_data(requests[0].user_id);
            set_avatar(u.image)
        }
        if(requests.length > 0) { fetch() };
    }, []);

    const _notes = (
        <SideLeft>
        <div className={styles.requests} onClick={() => set_selected(1)}>
            {requests.length === 0 ? <div className={styles.requests__icon}><FaUserPlus /></div> : <div className={styles.requests__image}><img src={avatar} /><div className={styles.requests__badge}><small>{requests.length}</small></div></div>}
            <Column fixed={true} gap={0.5}>
                <p className='bold'>Follow requests</p>
                <small className='medium'>Aprove or ignore requests</small>
            </Column>
        </div>
        <Empty message="You have no new notifications">{notifications.map(item => <Notification select={set_selected} data={item} />)}</Empty>
        </SideLeft>
    );

    const _requests = (
        <SideRightModal>
            <Row gap={1}>
                <Icon medium={true} action={() => set_selected(0)}><IoChevronBackSharp /></Icon>
                <h2>Requests</h2>
            </Row>
            <Empty message="You have no new requests">{requests.map(item => <Request data={item} />)}</Empty>
        </SideRightModal>
    )

    const content = [_notes, _requests];


    return (
        <main className={styles.modal} onClick={() => props.set_show(false)}>
            <section onClick={e => e.stopPropagation()} className={styles.notes}>
                {content[selected]}
            </section>
        </main>
    )
}

export default Notifications