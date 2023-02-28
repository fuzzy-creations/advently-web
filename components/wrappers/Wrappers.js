import styles from '../../styles/components/wrappers/wrappers.module.scss';
import { delay } from '../../tools/Global_Functions';


const Main = (props) => <main className={styles.dashboard}>{props.children}</main>
const Content = (props) => <section className={styles.content}>{props.children}</section>
const Side = (props) => <section className={styles.side}>{props.children}</section>
const Section = (props) => <section className={styles.section}>{props.children}</section>
const List = (props) => <section className={styles.list} style={{height: props.state ? `${props.height}rem` : "auto", gridTemplateRows: `${props.height}rem`, gridAutoRows: `${props.height}rem`, paddingTop: `${props.padding}rem`}}>{props.children}</section>
const FlexList = (props) => <section className={styles.flex_list} style={{height: props.state ? `${props.height}rem` : "auto"}}>{props.children}</section>
const Header = (props) => <section className={styles.header} style={{animationDelay: delay(0, props.delay)}}><h2>{props.children}</h2>{props.action ? <p className={styles.header__action} onClick={() => props.action(!props.state)}>{props.state ? "View All" : "Hide"}</p> : null}</section>
const Menu = (props) => <section className={styles.menu} style={{paddingBottom: `${props.padding}rem`}}>{props.children.map((item, index) => <div className={`${styles.menu__item} ${props.selected === index ? styles.menu__item__active : null}`}  onClick={() => props.select(index)} style={{animationDelay: delay(index, props.delay)}}><p>{item}</p></div>)}</section>


export { Main, Content, Side, Section, List, FlexList, Header, Menu }
