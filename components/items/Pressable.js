import React, { useState } from 'react';
import styles from '../../styles/components/UI/Modal.module.scss';

function Pressable(props){
    const [open, set_open] = useState(false);

    const close_modal = (e) => {
        if(e.target.className == "modal") {
            document.body.style.overflow = 'unset';
            set_open(false);
        };
    };

    return (
        <>
        <div style={{display: "flex", height: props.height}} onClick={() => set_open(true)}>{props.children}</div> 
        {open ? ( 
            <main className="modal" onClick={close_modal}>
                {React.cloneElement(props.content, { close: () => set_open(false) })}
            </main> 
        ) : null}
        </>
    )


}


export default Pressable;