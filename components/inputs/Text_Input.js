import styles from '../../styles/components/inputs/Inputs.module.scss';

function Text_Input (props) {


    return (
        <div className={styles.text}>
            <input className={styles.text__input} placeholder={props.placeholder} value={props.value} onChange={(e) => props.input(e.target.value)} />
            <label>{props.children}</label>
        </div>
    )
}

export default Text_Input;