import React, { useState } from 'react';
import { message_time, time_since } from '../../tools/DateTime_Methods';
import styles from '../../styles/components/items/Message.module.scss';
import { Column, Row, RowSpaced } from '../../tools/global_components';



function Direct_Message(props){
    const message = props.data
    const sender = props.sender;
    const user = props.user;

    return (
        <div className={styles.direct}>
            <div className={sender ? styles.direct__sender : styles.direct__message}>
                <Row gap={1} nowrap={true}>
                    {sender ? null : <img className={styles.avatar} src={user.image} />}
                    <Column fixed={true} gap={0.5}>
                        <p class="bold">{user.name.split(" ")[0]}</p>
                        <p className={sender ? styles.sender : styles.contact}>{message.content}</p>
                        <small>{time_since(message.created.seconds)}</small>
                    </Column>
                </Row>
            </div>
        </div>
    )
}

export default Direct_Message;