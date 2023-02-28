import styles from '../../styles/components/wrappers/Animations.module.scss';
import { delay } from '../../tools/Global_Functions';

const SideUp = (props) => <div className={styles.sideup} style={{animationDelay: delay(props.index, props.delay), height: props.height, width: props.width }}>{props.children}</div>
const SideDown = (props) => <div className={styles.sidedown} style={{animationDelay: delay(props.index, props.delay), height: props.height, width: props.width }}>{props.children}</div>
const SideRight = (props) => <div className={styles.sideright} style={{animationDelay: delay(props.index, props.delay), height: props.height, width: props.width }}>{props.children}</div>
const SideLeft = (props) => <div className={styles.sideleft} style={{animationDelay: delay(props.index, props.delay), height: props.height, width: props.width }}>{props.children}</div>
const SideRightModal = (props) => <div className={styles.siderightmodal} style={{animationDelay: delay(props.index, props.delay), height: props.height, width: props.width }}>{props.children}</div>
const SideLeftModal = (props) => <div className={styles.sideleftmodal} style={{animationDelay: delay(props.index, props.delay), height: props.height, width: props.width }}>{props.children}</div>


export { SideUp, SideRight, SideDown, SideLeft, SideLeftModal, SideRightModal }
