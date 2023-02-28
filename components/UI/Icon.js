import { useNavigate } from 'react-router-dom';
import styles from '../../styles/components/UI/Icon.module.scss';


function Icon (props) {
    
    return (
        <div onClick={props.action ? props.action : null} className={`${styles.icon} ${props.selected ? styles.selected : null} ${props.small ? styles.small : null} ${props.light ? styles.light : null}`} style={{backgroundColor: props.enable ? "var(--background_medium)" : null}}>
            {props.badge ? <div className={styles.badge}></div> : null}
            {props.children}
        </div>
    )
}

export default Icon