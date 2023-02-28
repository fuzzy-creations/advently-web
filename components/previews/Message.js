import React, { useContext, useEffect, useState } from 'react';
import { time_since } from '../../tools/DateTime_Methods';
import styles from '../../styles/components/previews/Message.module.scss';
import { Link } from 'react-router-dom';
import { Column, Row, RowSpaced } from '../../tools/global_components';
import Icon from '../UI/Icon';
import { FiTrash } from "react-icons/fi";
import Pressable from '../items/Pressable';
import { delete_chat } from '../../firebase/methods/Message_Functions';
import { AuthContext } from '../../contexts/Auth.context';

function Message(props){
    const [options, set_options] = useState(false);
    const { user } = useContext(AuthContext);
    const data = props.data;
    const contact = data.contact;
    const message = data.messages ? data.messages[data.messages.length - 1] : "";
    const unread = data.unread;


    const delete_chat_handler = () => {
        delete_chat(data.chat_id, user);
    };



    return props.new ? (
        <div className={styles.container} style={{backgroundColor:"var(--background_medium)"}}>
            <Row gap={2}>
                <div className={styles.image} style={{"backgroundImage": `url(${data.image})`}} />
                <Column gap={1} fixed={true}>
                    <p class="bold">{data.name}</p>
                    <small>Start new conversation</small>
                </Column>
            </Row>
        </div>
    ) : (
        <div className={styles.container} style={{backgroundColor: props.selected.id === contact.id ? "var(--background_medium)" : null}} onClick={() => props.select(contact)}>

               <div className={styles.image} style={{"backgroundImage": `url(${contact.image})`}} />
                <Column gap={1} fixed={true} width={"100%"}>
                    <p class="bold">{contact.name}</p>
                    <small class="light">{message ? time_since(message.created.seconds) : null}</small>
                    <small style={{fontWeight: unread ? 600 : 400}}>{message ? `${message.content.slice(0, 55)}${message.content.length > 50 ? "..." : "" }` : ""}</small>
                    {unread ? <small className={styles.unread}></small> : null }
                </Column>
                <div className={styles.delete}><Icon action={(e) => {e.stopPropagation(); delete_chat_handler()}} small={true} light={true}><FiTrash /></Icon></div>
        </div>
    );
};

export default Message;
