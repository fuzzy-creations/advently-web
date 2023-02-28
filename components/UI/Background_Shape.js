
import styles from '../../styles/components/UI/Background_Shape.module.scss';

function Background_Shape (props) {
    const color = props.fade ? {pink: styles.pink_fade, blue: styles.blue_fade, purple: styles.purple_fade, green: styles.green_fade}[props.color] : {pink: styles.pink, blue: styles.blue, purple: styles.purple, green: styles.green}[props.color]


    return (
        <div className={`${color} ${color}"_fade`} style={{borderRadius: props.radius ? props.radius : "2rem", [props.custom]: props.amount}}>
            {props.children}
        </div>
    )
}

export default Background_Shape;