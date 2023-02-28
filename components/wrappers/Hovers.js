import styles from '../../styles/components/wrappers/Hovers.module.scss';

const Flip = (props) => <div className={styles.flip}>{props.children}</div>
const Flip_Front = (props) => <div className={`${styles.flip__side} ${styles.flip__side__front}`}>{props.children}</div>
const Flip_Back = (props) => <div className={`${styles.flip__side} ${styles.flip__side__back}`}>{props.children}</div>


export { Flip, Flip_Front, Flip_Back }
