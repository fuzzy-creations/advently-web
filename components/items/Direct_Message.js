import React, { useState } from 'react';
import { message_time, time_since } from '../../tools/DateTime_Methods';
import styles from '../../styles/components/items/Direct_Message.module.scss';
import { Column, Row } from '../../tools/global_components';



function Direct_Message(props){
    const message = props.data
    const sender = props.sender;

    return (
        <div className={styles.direct}>
            <div className={sender ? styles.direct__sender : styles.direct__message}>
                <Row gap={1}>
                    {sender ? null : <img className={styles.avatar} src={props.user.image} />}
                    <Column fixed={true} gap={0.5}>
                        <p className={sender ? styles.sender : styles.contact}>{message.content}</p>
                        <small>{time_since(message.created.seconds)}</small>
                    </Column>
                </Row>
            </div>
        </div>
    )
}

export default Direct_Message;