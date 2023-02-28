import styles from '../../styles/components/inputs/Inputs.module.scss';

function Number_Input (props) {

    return (
        <div className={styles.text}>
            <input disabled={props.invalid} className={`${styles.text__input} ${props.invalid ? styles.number__input__invalid : null}` } type="number" value={props.value} onChange={(e) => props.input(e.target.value)} />
            <label>{props.children}</label>
            {props.tag ? <p>{props.tag}</p> : null}
        </div>
    )
}

export default Number_Input;