import React, { useState, useEffect } from 'react';
import styles from '../../styles/pages/root/Loader_Page.module.scss';
import Item_Loader from '../../components/UI/Item_Loader';

function Loader_Page(){
    const [display, set_display] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            set_display(true);
        }, 2000)
    }, [])

    return (
        <main className={styles.loader}>
            <div className={styles.wrapper}>
                <div className={styles.logo}></div>
            </div>
            {display ? <div className={styles.item}><Item_Loader /></div> : <div className={styles.item}></div>}
        </main>
    )
}

export default Loader_Page;