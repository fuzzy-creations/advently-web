import React, { useState, useContext } from 'react';
import { Link, useNavigate, Redirect } from 'react-router-dom';
import styles from '../../styles/pages/auth/Forms.module.scss';
import { AuthContext } from '../../contexts/Auth.context';
import Button_Main from '../../components/buttons/Button_Main';
import Text_Input from '../../components/inputs/Text_Input';
import Password_Input from '../../components/inputs/Password_Input';
import { FaWindows, FaGoogle } from 'react-icons/fa';
import { IoChevronBackSharp, IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';
import { SideLeft, SideRight, SideUp } from '../../components/wrappers/Animations';




function Register(props){  
    const history = useNavigate();
    const { register_user, sign_in_with_microsoft, sign_in_with_google } = useContext(AuthContext);
    const [stage, set_stage] = useState(0)
    const [name_input, set_name_input] = useState("");
    const [email_input, set_email_input] = useState("");
    const [password_input, set_password_input] = useState("");
    const [loader, set_loader] = useState(false);
    const [status, set_status] = useState("");


    const next_active_handler = () => {
        if(stage === 0) return name_input.length >= 3 && name_input.length < 20;
        if(stage === 1) return email_input.length >= 3;
        if(stage === 2) return password_input.length >= 3;
    }

    const submit_handler = () => {
        if(loader === false) {
            set_loader(true);
            const user_main = {email: email_input, password: password_input};
            const user_profile = {name: name_input};
            register_user(user_main, user_profile).then(result => {
                if(result === true) {
                    set_status("Created");
                    history("/");
                } else {
                    set_loader(false)
                    set_status(result);
                }
            })
        };
    };  

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

    const continue_handler = () => set_stage(stage + 1);
    const back_handler = () => stage === 0 ? props.close() : set_stage(stage - 1);

    const key_handler = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            if(stage === 2) {
                submit_handler()
            } else {
                if(next_active_handler()) {
                    continue_handler();
                }
            }
        }
    }

    const stage_one = (
        <>
        <SideLeft index={0} delay={1}><VscAccount /></SideLeft>
        <h3 className={styles.title}>To start, what's your name?</h3>
        <Text_Input value={name_input} input={set_name_input}>Name</Text_Input>
        <Button_Main active={next_active_handler()} action={continue_handler}>Next</Button_Main>
        </>
    );

    const stage_two = (
        <>
        <SideRight><IoMailOutline /></SideRight>
        <h3 className={styles.title}>Enter your email address</h3>
        <Text_Input value={email_input} input={set_email_input}>Email</Text_Input>
        <Button_Main active={next_active_handler()} action={continue_handler}>Next</Button_Main>
        </>
    );

    const stage_three = (
        <>
        <SideLeft><IoLockClosedOutline /></SideLeft>
        <h3 className={styles.title}>Lastly, set your password</h3>
        <Password_Input value={password_input} input={set_password_input}>Password</Password_Input>
        <Button_Main active={next_active_handler()} loader={loader} action={submit_handler}>Complete</Button_Main>
        </>
    );

    const content = [stage_one, stage_two, stage_three];
    
    return (
        <SideUp>
            <main className={styles.main} onKeyDown={(e) => key_handler(e)}> 
                <div className={styles.header} onClick={back_handler}><IoChevronBackSharp /></div>
                <section className={styles.container}>
                    {/* <h1>Get Started</h1> */}
                    {content[stage]}
                    {/* {stage === 2 ? <Button_Main active={next_active_handler()} loader={loader} action={submit_handler}>Complete</Button_Main> : <Button_Main active={next_active_handler()} action={continue_handler}>Next</Button_Main> } */}
                    <p onClick={() => props.close()} className={`medium ${styles.close}`}>Back to <span class="bold">Login</span></p>
                    <p>{status}</p>
                    <SideUp index={0} delay={2} width={"100%"}><div className={styles.divider}></div></SideUp>
                    <SideUp index={0} delay={1.5} width={"100%"}>
                    <div className={styles.alt_logins}>
                        <div className={styles.alt_logins__action} onClick={mirosoft_submit_handler}><FaWindows /> <p>Sign up with Microsoft</p></div>
                        <div className={styles.alt_logins__action} onClick={google_submit_handler}><FaGoogle /> <p>Sign up with Google</p></div>
                    </div>
                    </SideUp>
                    {/* <small class="medium">Not available on iOS or Android (yet)</small> */}
                </section>
            </main>
        </SideUp>
    )
}

export default Register;