import React, { useContext, useState } from 'react';
import { db } from '../../firebase/Firebase';
import styles from '../../styles/pages/root/Contact.module.scss';
import Text_Input from '../../components/inputs/Text_Input';
import Button_Main from '../../components/buttons/Button_Main';

function Contact(props){
    const [status, set_status] = useState("");
    const [loader, setLoader] = useState(false);
    const [email, set_email] = useState("");
    const [message, set_message] = useState("");

    const send_handler = (e) => {
        e.preventDefault()
        try {
            db.collection('mail').add({
                to: 'advently.app@gmail.com',
                message: {
                  subject: 'New contact form',
                  html: `${message}`,
                },
              })
            set_status("sent")
            set_message("");
        } catch(error) {
            set_status(error.message)
        }
        
    }

    return (
        <div className={styles.form}>
                <h2>Contact Us</h2>
                <p>Email us at: advently.app@gmail.com or fill out the form below</p>
                <Text_Input value={email} input={set_email}>Email</Text_Input>
                <Text_Input value={message} input={set_message}>Message</Text_Input>
                <Button_Main>Send</Button_Main>                  
                {status}
        </div>
    )
}

export default Contact;