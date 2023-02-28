import React from 'react';
import styles from '../../styles/components/wrappers/Empty.module.scss';

function Missing (props) {
    return (
        <div className={styles.empty}>
            <div>icon</div>
            <h4 className={styles.empty__title}>There's nothing here</h4>
        </div>
    )
};

export default Missing