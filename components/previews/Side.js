import React, { useState, useEffect, useContext } from 'react';
import { Column } from '../../tools/global_components';
import { IoChevronForwardSharp } from "react-icons/io5";
import styles from '../../styles/components/previews/Side.module.scss'
import { Link } from 'react-router-dom';


function Side_Preview(props) {
    const data = props.data;

    return (
        <Link to={`/event/${data.id}`} state={data} params={{data: data}} className={styles.side}>
            <img src={data.image} />
            <div className={styles.side__content}>
                <p class="bold">{data.name}</p>
                <small class="medium">{data.organiser.name}</small>
            </div>
            <IoChevronForwardSharp />
        </Link>
    )
}

export default Side_Preview;