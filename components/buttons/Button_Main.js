import React from 'react';
import styles from '../../styles/components/buttons/Button_Main.module.scss';
import Item_Loader from '../UI/Item_Loader';

function Button_Main(props){


    const action_handler = () => {
        if(props.action === undefined) return 
        if(props.loader) return
        if(props.active || props.active === undefined) return props.action();
        return
    }


    return (
        <button 
            className={`${styles.button} ${props.hollow ? styles.hollow : null}`} 
            style={{
                width: props.size || "100%", 
                backgroundColor: props.hollow ? "var(--background_light)" : props.active || props.active === undefined ? "var(--primary)" : "var(--text_medium)",
                borderColor: props.active || props.active === undefined ? "var(--primary)" : "var(--text_medium)",
                }}
                 onClick={() => action_handler()} >
            {props.loader || props.error ? <Item_Loader /> : props.children}
        </button>
    )
}


export default Button_Main;