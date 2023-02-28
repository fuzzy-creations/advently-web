import styles from '../../styles/components/wrappers/Empty.module.scss';
import image from '../../assets/cat.png';
import Button_Main from '../buttons/Button_Main';
import { IoLockClosedOutline  } from "react-icons/io5";

const Empty = (props) =>  (
    props.children.length === 0 || props.children.length === undefined ? (
        <section className={styles.element}>
            <img className={styles.image} src={image} />
            <p class="medium bold">No items here</p>
            <small className={styles.text}>{props.message}</small>
        </section>
    ) : props.children
);

const Hide = ( props ) => props.active === 0 ? null : props.children;

const Private = (props) => {
    return props.access ? props.children : (
        <section className={styles.private}>
            <div className={styles.private__wrapper}>
                <IoLockClosedOutline />
                <h4 class="medium">Private</h4>
                <p class="light">{props.message}</p>
            </div>
        </section>
    )
}

export { Empty, Hide, Private };