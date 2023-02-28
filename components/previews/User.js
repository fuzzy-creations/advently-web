import React, { useState, useEffect, useContext } from 'react';
import { Column, ColumnCentered } from '../../tools/global_components';
import styles from '../../styles/components/previews/User.module.scss'
import { get_user_data } from '../../firebase/methods/User_Functions';
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import Loader from '../UI/Loader';
import { SideUp } from '../wrappers/Animations';
import Pressable from '../items/Pressable';
import Profile from '../screens/Profile';
import { IoAddCircleOutline, IoCloseCircleOutline, IoCheckmarkCircleOutline, IoTimeOutline } from "react-icons/io5";
import Icon from '../UI/Icon';



function User(props) {
    const { user_profile } = useContext(ProfileDataContext)
    const [user_data, set_user_data] = useState(props.data ? props.data : null);
    const [loader, set_loader] = useState(props.data ? false : true);

    useEffect(() => {
        const fetch_data = async () => {
            const user_data = await get_user_data(props.id);
            set_user_data(user_data);
            set_loader(false);
        }
        if(props.id) { fetch_data() }; 
    }, [])

    const selected = props.list ? props.list.find(item => item.id === user_data.id) : null;

    const select_handler = () => selected ? props.select(props.list.filter(item => item.id !== user_data.id)) : props.select([...props.list, user_data]);

    if(loader) { return <Loader /> }

    return props.select ? (
        <SideUp delay={props.delay} index={props.index}>
            <div className={styles.user} style={{backgroundColor: selected ? "var(--background_medium)" : null}} onClick={props.list ? select_handler : () => props.select(user_data)}>
                <img className={styles.image} src={user_data.image} />
                <p class="bold">{user_data.name.split(" ")[0]}</p>
            </div>
        </SideUp>
    ) : (
        <Pressable content={<Profile data={user_data} action={props.action} />}>
            <SideUp delay={props.delay} index={props.index}>
                <div className={styles.user}>
                    <img className={styles.image} src={user_data.image} />
                    <p class="bold">{user_data.name.split(" ")[0]}</p>
                </div>
            </SideUp>
        </Pressable>
    )
}

export default User;