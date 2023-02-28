import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/previews/Invite.module.scss';
import { day_month, event_format, invite_preview_format } from '../../tools/DateTime_Methods';
import { AuthContext } from '../../contexts/Auth.context';
import { Column, Row, RowSpaced } from '../../tools/global_components';
import { BsDot } from "react-icons/bs";
import { delay } from '../../tools/Global_Functions';
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
import Users from '../items/Users';
import { Flip, Flip_Back, Flip_Front } from '../wrappers/Hovers';
import { LocationContext } from '../../contexts/Location.context';
import Icon from '../UI/Icon';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { accept_event_invite, decline_event_invite } from '../../firebase/methods/Event_Functions';
import { SideUp } from '../wrappers/Animations';

function Invite(props) {
    const { user_profile } = useContext(ProfileDataContext);
    const data = props.data;
    const { location, calculate_distance } = useContext(LocationContext);
    const [day, month] = day_month(data.start).split(" ");
    const address = location && data.coordinates ? calculate_distance(data.coordinates.latitude, data.coordinates.longitude) + " miles" : data.location ? data.location.split(",")[1] : "N'A";


    return (
       <SideUp delay={props.delay} index={props.index}>
            <Link to={`/event/${data.id}`} state={data} params={{data: data}} className={styles.image} style={{background: `linear-gradient(130deg, #32324b96,  #00000080 ), url(${data.image})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                <RowSpaced nowrap={true}>
                    <Column gap={1.5}>
                        <Column fixed={true} gap={0.5}>
                            <small class="light">{data.organiser.name}</small>
                            <p class="white bold">{data.name}</p>
                        </Column>
                        <Row gap={0.5}>
                            <small className={styles.highlight}>{data.time}</small>
                            <small className={styles.highlight}>{address}</small>
                            <small className={styles.highlight}>{data.private_status ? "Private" : "Public" || null}</small>
                        </Row>
                    </Column>
                    <div className={styles.date}>
                            <h4 class="white bold">{day}</h4>
                            <small class="medium">{month}</small>
                        </div>
                </RowSpaced>
                <Column gap={1} fixed={true}>
                    <RowSpaced>
                        <Users amount={2} data={data.members} />
                        <Row>
                            <Icon action={(e) => { e.preventDefault(); accept_event_invite(user_profile, data) }}><IoCheckmarkSharp /></Icon>
                            <Icon action={(e) => { e.preventDefault(); decline_event_invite(user_profile.id, data.id) }}><IoCloseSharp /></Icon></Row>
                    </RowSpaced>
                </Column>
            </Link>

       </SideUp>
    )
}

export default Invite;

