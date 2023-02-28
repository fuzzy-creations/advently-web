import { useState } from 'react';
import styles from '../../styles/components/inputs/Inputs.module.scss';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';


function Password_Input (props) {
    const [hide_password, set_hide_password] = useState(true);
    
    return (
        <div className={styles.text}>
            <input className={styles.text__input} type={hide_password ? "password" : "text"} value={props.value} onChange={(e) => props.input(e.target.value)} />
            <div className={styles.text__input__icon} onClick={() => set_hide_password(password => !password)}>{hide_password ? <IoEyeOffOutline /> : <IoEyeOutline />}</div>
            <label>{props.children}</label>
        </div>
    );
};


export default Password_Input;