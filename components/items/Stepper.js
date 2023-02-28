
import styles from '../../styles/components/items/Stepper.module.scss';
import { VscCircleFilled, VscCircleLargeOutline } from "react-icons/vsc";

function Stepper (props) {

    // console.log(props.active())

    const next_handler = (index) => {
        if(props.active === false) return
        props.select(index)
    }

    const _step = (name, index) => {


        return (
            <div className={styles.stepper__item} onClick={() => next_handler(index)}>
                <div className={styles.stepper__icon}>{props.selected === index ? <VscCircleLargeOutline /> : <VscCircleFilled />}</div>
                <p>{name}</p>
            </div>
        )
    }


    return (
        <div className={styles.stepper}>
            {props.steps.map((item, index) => item === null ? null : _step(item, index))}
        </div>
    )
}

export default Stepper;