import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/items/Chat.module.scss';
import { AuthContext } from '../../contexts/Auth.context';
import Send_Message from '../../components/items/Send_Message';
import { create_chat, send_direct_message, read_direct_message, delete_chat, toggle_block_chat } from '../../firebase/methods/Message_Functions';
import Direct_Message from '../../components/items/Direct_Message';
import { Link } from 'react-router-dom';
import Icon from '../UI/Icon';
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { ProfileDataContext } from '../../contexts/ProfileData.context';
import { get_chat_id } from '../../tools/Global_Functions';


function Chat(props){  
    const { user } = useContext(AuthContext);
    const { user_profile, chats } = useContext(ProfileDataContext);
    console.log(props)
    const data = chats.find(item => item.contact.id === props.data.id);
    const contact = props.data;


    const [message_input, set_message_input] = useState("");
    const [display_options, set_display_options] = useState(false);
    const [blocked, set_blocked] = useState(false);
    const [block, set_block] = useState(false);
    const [loader, set_loader] = useState(false);

    console.log(data)



    useEffect(() => {
        if(data) { read_direct_message(data.chat_id) }
    }, [data])

    
      const error_handler = (e) => alert(e);

      const message_handler = async () => {
          if(message_input === "") return;
          // check to see if chat exists before create new
          if(data === undefined) { create_chat(get_chat_id(user_profile.id, contact.id), user_profile, contact.id, message_input); set_message_input(""); return }
          send_direct_message(data.chat_id, user_profile, data.contact.id, message_input).then(result => result === true ? set_message_input("") : error_handler(result));
      }

      const delete_chat_handler = () => {
        //   delete_chat(chat_id, user).then(result => result === true ? props.navigation.goBack() : alert("Delete failed"));
      };
      const block_handler = () => {
        //   toggle_block_chat(chat_id, user, block).then(result => result === true ? set_block(block => !block) : alert("Failed"));
         
      };


    return (
        <main className={styles.chat}>
            <section className={styles.messages}>{data && data.messages ? data.messages.map((message, index) => <Direct_Message data={message} user={data.contact} sender={message.sender === user} key={index} /> ).reverse() : null}</section>
            <section className={styles.action}><Send_Message valid={true} value={message_input} input={set_message_input} action={message_handler}>Enter something</Send_Message></section>
        </main>
    );
};

export default Chat;

