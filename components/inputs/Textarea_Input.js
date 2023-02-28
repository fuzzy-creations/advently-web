import styles from '../../styles/components/inputs/Inputs.module.scss';

function Textarea_Input (props) {

    return (
        <div className={styles.text}>
            <textarea className={styles.text__areainput} value={props.value} style={{height: props.height}} onChange={(e) => props.input(e.target.value)} />
            <label>{props.children}</label>
        </div>
    )
}

export default Textarea_Input;