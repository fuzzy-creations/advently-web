import { useState } from 'react';
import styles from '../../styles/components/inputs/Time_Input.module.scss';


function Time_Input (props) {
    const time = props.value.split(":");
    const [hour, set_hour] = useState(time[0]);
    const [minute, set_minute] = useState(time[1])
    const [show, set_show] = useState(false);
    const hours = new Array(24).fill().map((item, index) => {
        return index.toLocaleString('en-US', {minimumIntegerDigits: 2})
    })

    const minutes = new Array(12).fill().map((item, index) => {
        const min = 5;
        return (min * index).toLocaleString('en-US', {minimumIntegerDigits: 2});
    })

    const display_handler = (num) => {
        if(show === num) { set_show(false) } else { set_show(num) }
    };

    const select_handler = (item) => {
        show === 0 ? set_hour(item) : set_minute(item);
        show === 0 ? props.set_time(`${item}:${minute}`) : props.set_time(`${hour}:${item}`);
        set_show(false);
    }

    const display = (
        <div className={styles.display}>
            {show === false ? null : [hours, minutes][show].map((item, index) => <div onClick={() => select_handler(item)} className={styles.item}><p>{item}</p></div>)}
        </div>
    )

    return (
        <section className={styles.container}>
            <div className={styles.time}>
                <p onClick={() => display_handler(0)} className={`${styles.selector} ${show === 0 ? styles.active : null}`}>{hour}</p>
                :
                <p onClick={() => display_handler(1)} className={`${styles.selector} ${show === 1 ? styles.active : null}`}>{minute}</p>
            </div>
            {show === false ? null : display}
        </section>
    );
};

export default Time_Input;