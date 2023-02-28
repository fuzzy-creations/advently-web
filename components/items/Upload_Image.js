import React from 'react';
import { IoCameraOutline } from "react-icons/io5";
import styles from '../../styles/components/items/Upload_Image.module.scss';

function Upload_Image(props) {

    const upload_handler = (e) => {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);
        props.file(file);
        props.preview(preview);
    }
    
    return (
        <div className={styles.container} style={{"backgroundImage": `url(${props.value})`}}>
            <input className={styles.input} name="image" type="file" accept="image/*" onChange={(e) => upload_handler(e)} />     
            <IoCameraOutline />
        </div>
    )
}

export default Upload_Image;