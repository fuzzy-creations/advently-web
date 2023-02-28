import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/components/items/Notification.module.scss';
import { time_since } from '../../tools/DateTime_Methods';
import { delete_note } from '../../firebase/methods/Notification_Functions';
import { AuthContext } from '../../contexts/Auth.context';
import { Column } from '../../tools/global_components';

function Notification (props) {
    const { user } = useContext(AuthContext);
    const data = props.data
    const delete_handler = () => { delete_note(user, data.note_id) }
    console.log(data)
    const navigate = useNavigate();

    const navigation_handler = async () => {
        console.log(data)
        if(data.type === 4) {
           props.select(1)
        }
        if(data.type === 3) {
            // const d = await get_user_data(data.ref_id);
            // return navigate("Chat", d)
        }
        if(data.type === 2) {
            return navigate('/event/' + data.ref_id)
        }
        if(data.type === 1) {
            return navigate('/community/' + data.ref_id)
        }
        if(data.type === 0) {
            return navigate('/profile')
        }
    }


    return (
        <div className={styles.notification} onClick={navigation_handler}>
            <div className={styles.image} style={{"backgroundImage": `url(${data.image})`}}></div>
            <Column fixed={true} gap={0.5}>
                <p class="bold">{data.title}</p>
                <p class="medium">{data.message}</p>
                <small class="medium">{ time_since(data.created.seconds) }</small>
            </Column>
        </div>
    )
}

export default Notification;