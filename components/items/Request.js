import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/items/Request.module.scss';
import { time_since } from '../../tools/DateTime_Methods';
import { accept_event_request, remove_event_request } from '../../firebase/methods/Event_Functions';
import { accept_group_request, remove_group_request } from '../../firebase/methods/Group_Functions';
import { accept_request, get_user_data, remove_request } from '../../firebase/methods/User_Functions';
import { Column } from '../../tools/global_components';
import { AiOutlineDelete, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Icon from '../UI/Icon';
import Pressable from './Pressable';
import User from '../previews/User';
import Profile from '../screens/Profile';

function Request (props) {
    const data = props.data;
    const ref = props.data.id
    const [user_data, set_user_data] = useState({});
    const [hide, set_hide] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(data.user_id)
            set_user_data(u)
        }
        fetch()
    }, [])

    const accept_handler = () => {
        if(data.type === 0){accept_request(data.data, data.user_id)}
        if(data.type === 1){accept_group_request(data.user_id, data.data)}
        if(data.type === 2){accept_event_request(data.user_id, data.data)}
    }
    

    const decline_handler = () => {
        if(data.type === 0){remove_request(data.user_id, ref)}
        if(data.type === 1){remove_group_request(data.user_id, ref)}
        if(data.type === 2){remove_event_request(data.user_id, ref)}
    }


    return (
        <Pressable content={<Profile data={user_data} />}>
            <div className={`${styles.request} ${hide ? styles.hide : null}`}>
                <div className={styles.image} style={{"backgroundImage": `url(${user_data.image})`}}></div>
                <Column fixed={true} gap={0.5}>
                    <p class="bold">{user_data.name}</p>
                    <p class="medium">{data.name}</p>
                </Column>
                <div className={styles.options}> 
                <Icon light={true} action={() => accept_handler()}><AiOutlineCheck /></Icon>
                <Icon light={true} action={() => decline_handler()}><AiOutlineClose /></Icon>
                </div>
            </div>
        </Pressable>
    )
}

export default Request;