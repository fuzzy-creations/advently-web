import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/previews/Community.module.scss';
import { group_types } from '../../tools/Global_Variables';
import { Column, Row, RowSpaced } from '../../tools/global_components';
import { SideUp } from '../wrappers/Animations';
import Users from '../items/Users';
import { IoArrowForwardSharp, IoLocationOutline } from "react-icons/io5";

function Community (props) {
    const data = props.data;
    const type = group_types[data.type];
    const icons_background = ["var(--thirdary_light)", "var(--primary)", "var(--secondary_light)", "var(--text_medium)"]
    const colors = ["green", "pink", "blue", "purple"];

    // MEMBERS, UPCOMING EVENTS, LOCATION

    return (
        <SideUp delay={props.delay} index={props.index}>
           <Link to={`/community/${data.id}`} state={data} params={{data: data}} className={styles.profile}>
                <section className={styles.container} style={{background: `linear-gradient(130deg, #32324b96,  #00000080 ), url(${data.image})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                    <RowSpaced nowrap={true} gap={1}>
                        <Column gap={1} fixed={true}>
                            <small className='primary'>{group_types[data.type]}</small>
                            <p class="white bold" style={{fontSize: '1.9rem'}}>{data.name}</p>
                            {/* <Row gap={1}><IoLocationOutline /><small class="medium">{data.location}</small></Row> */}
                            <small className={styles.highlight}>{data.location}</small>
                        </Column>
                        {/* <div className={styles.avatar} style={{"backgroundImage": `url(${data.image})`}}></div> */}
                    </RowSpaced>
                    <small className={styles.about}>{data.about}</small>
                </section>
                <section className={styles.members}>
                    <Users data={data.members} />
                    <div className={styles.members__text}><small>{data.upcoming.length} New</small><IoArrowForwardSharp /></div>
                </section>
           </Link>
        </SideUp>
    );

}

export default Community;


