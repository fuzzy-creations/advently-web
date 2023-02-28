import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth.context';
import styles from '../../styles/pages/auth/Forms.module.scss';
import Button_Main from '../../components/buttons/Button_Main';
import Text_Input from '../../components/inputs/Text_Input';
import Password_Input from '../../components/inputs/Password_Input';
import { FaWindows, FaGoogle } from 'react-icons/fa';
import { IoChevronBackSharp } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';
import { SideLeft, SideRight, SideUp } from '../../components/wrappers/Animations';


function Login(props){
    const history = useNavigate();
    const { sign_in, sign_in_with_microsoft, sign_in_with_google } = useContext(AuthContext);
    const [name_input, set_name_input] = useState("");
    const [email_input, set_email_input] = useState("");
    const [password_input, set_password_input] = useState("");
    const [loader, set_loader] = useState(false);
    const [status, set_status] = useState("");

    const submit_handler = () => {
        set_loader(true);
        sign_in({email: email_input, password: password_input}).then(result => {
            if(result === true){
                set_status("Logged in");
                history("/");
            } else {
                set_loader(false);
                set_status(result);
            }
        })        
    }

    const mirosoft_submit_handler = () => {
        if(loader === false) {
            set_loader(true);
            sign_in_with_microsoft().then(result => {
                if(result === true) {
                    set_status("Created");
                } else {
                    set_loader(false)
                    set_status(result);
                }
            })
        };
    };  

    const google_submit_handler = () => {
        if(loader === false) {
            set_loader(true);
            sign_in_with_google().then(result => {
                if(result === true) {
                    set_status("Created");
                } else {
                    set_loader(false)
                    set_status(result);
                }
            })
        };
    };  


    const key_handler = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            submit_handler()
        }
    }

    const back_handler = () => history("/");

    return (
        <SideUp>
            <main className={styles.main} onKeyDown={(e) => key_handler(e)}>
                <div className={styles.header} onClick={() => props.close()}><IoChevronBackSharp /></div>
                <section className={styles.container}>
                    <SideLeft index={0} delay={1}><VscAccount /></SideLeft>
                    <h3 className={styles.title}>Enter your details</h3>
                    <Text_Input value={email_input} input={set_email_input}>Email</Text_Input>
                    <Password_Input value={password_input} input={set_password_input}>Password</Password_Input>
                    <Button_Main loader={loader} action={submit_handler}>Login</Button_Main>
                    <p onClick={() => props.close()} className={`medium ${styles.close}`}>Back to <span class="bold">Register</span></p>
                    <p>{status}</p>

                    <SideUp index={0} delay={2} width={"100%"}><div className={styles.divider}></div></SideUp>

                    <SideUp index={0} delay={1.5} width={"100%"}>
                    <div className={styles.alt_logins}>
                        <div className={styles.alt_logins__action} onClick={mirosoft_submit_handler}><FaWindows /> <p>Continue with Microsoft</p></div>
                        <div className={styles.alt_logins__action} onClick={google_submit_handler}><FaGoogle /> <p>Continue with Google</p></div>
                    </div>
                    </SideUp>
                    {/* <small class="medium">Not available on iOS or Android (yet)</small> */}
                </section>
            </main>
        </SideUp>
    )
}

export default Login;