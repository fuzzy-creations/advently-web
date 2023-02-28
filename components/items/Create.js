import styles from '../../styles/components/screens/Create.module.scss';
import { IoAddSharp } from "react-icons/io5";


function Create () {
    return (
        <div className={styles.create_card}>
            <IoAddSharp />
            {/* <p>Create</p> */}
        </div>
    )
}

export default Create;