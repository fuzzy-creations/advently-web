import React from 'react';
import styles from '../../styles/components/UI/Loader.module.scss';

function Loader(){
    return (
        <div className={styles.page}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default Loader;