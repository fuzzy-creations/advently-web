import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/previews/Event.module.scss';
import { day_month, event_format, invite_preview_format } from '../../tools/DateTime_Methods';
import { AuthContext } from '../../contexts/Auth.context';
import { Column, Row, RowSpaced } from '../../tools/global_components';
import { GoPrimitiveDot } from "react-icons/go";
import { delay } from '../../tools/Global_Functions';
import Users from '../items/Users';
import { SideUp } from '../wrappers/Animations';
import { IoArrowForwardSharp, IoLocationOutline } from "react-icons/io5";
import { LocationContext } from '../../contexts/Location.context';
import { Flip, Flip_Back, Flip_Front } from '../wrappers/Hovers';

function Event(props) {
    const data = props.data;
    const { location, calculate_distance } = useContext(LocationContext);

    const [day, month] = day_month(data.start).split(" ");
    const address = location && data.coordinates ? calculate_distance(data.coordinates.latitude, data.coordinates.longitude) + " miles" : data.location ? data.location.split(",")[1] : "N'A";

    return (
        <SideUp delay={props.delay} index={props.index}>
                <Flip>
                    <Flip_Front>
                        <Link to={`/event/${data.id}`} state={data} params={{data: data}} className={styles.event}>
                            <section className={styles.image} style={{"backgroundImage": `url(${data.image})`}}>
                                <div className={styles.date}>
                                    <h4 class="white bold">{day}</h4>
                                    <small class="medium">{month}</small>
                                </div>
                            </section>
                            <section className={styles.content}>
                                <Column gap={1} fixed={true}>
                                    <p class="white bold" style={{fontSize: '1.9rem'}}>{data.name}</p>
                                    <small className='primary'>{data.organiser.name}</small>
                                </Column>
                                <Row gap={1}>
                                    <small className={styles.highlight}>{data.time}</small>
                                    <small className={styles.highlight}>{address}</small>
                                    <small className={styles.highlight}>{data.private_status ? "Private" : "Public" || null}</small>
                                </Row>
                                <section className={styles.members}>
                                    <Users amount={4} no_count={true} data={data.members} />
                                    <Row gap={1}><small>{data.members.length} Going</small><IoArrowForwardSharp /></Row>
                                </section>
                            </section>
                        </Link>
                    </Flip_Front>
                    <Flip_Back>
                        <Link to={`/event/${data.id}`} state={data} params={{data: data}} className={styles.backside}>
                            <div className={styles.details}>{data.details.split('\n').map((item, key) => <p className={styles.details__text} key={key}>{item}{"\n"}</p>)}</div>
                            <div className={styles.details__footer}><small>Read More</small><IoArrowForwardSharp /></div>
                        </Link>
                    </Flip_Back>
                </Flip>
        </SideUp>
    )
}

export default Event;

