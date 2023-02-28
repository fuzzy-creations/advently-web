

function Modal (props) {

    const close_modal = (e) => {
        if(e.target.className == "modal") {
            document.body.style.overflow = 'unset';
            props.close();
        };
    };


    return (
        <main className="modal" onClick={close_modal}>
            {props.children}
        </main>
    )
}

export default Modal;
