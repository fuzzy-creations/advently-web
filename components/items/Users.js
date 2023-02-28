import React, { useEffect, useState } from 'react';
import { get_user_data } from '../../firebase/methods/User_Functions';
import styles from '../../styles/components/items/Users.module.scss';

function Users (props) {
    const amount = props.amount;
    const users = props.data.slice(0, amount || 3);

    return (
        <div className={styles.wrapper}>
            {users.map(item => <User user={item} />)}
           { props.no_count ? null : <div className={styles.avatar}><small>{props.data.length}</small></div>}
        </div>
    )
}

export default Users;

function User (props) {
    const [user_data, set_user_data] = useState({});

    useEffect(() => {
        const fetch = async () => {
            const u = await get_user_data(props.user);
            set_user_data(u)
        };
        fetch()
    }, [])


    const url = user_data ? user_data.image : null

    return <img className={styles.avatar} src={url} />
};