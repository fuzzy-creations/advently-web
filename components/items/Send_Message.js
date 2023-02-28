import React, { useEffect, useState } from 'react';
import Text_Input from '../inputs/Text_Input';
import styles from '../../styles/components/items/Send_Message.module.scss';
import Item_Loader from '../UI/Item_Loader';
import { VscArrowRight } from "react-icons/vsc";

function Send_Message(props){

    const key_handler = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            props.action()
        }
    }
    
    return (
        <div className={styles.message} onKeyDown={(e) => key_handler(e)}>
            <div className={styles.message__input}><Text_Input value={props.value} placeholder={props.children} input={props.input} /></div>
            <div className={styles.message__button} onClick={() => props.action()}>{props.loader ? <Item_Loader /> : <VscArrowRight />}</div>
        </div>
    )
}

export default Send_Message;
