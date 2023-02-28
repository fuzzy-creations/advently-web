import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Pressable from '../../components/items/Pressable';
import styles from '../../styles/pages/auth/Landing.module.scss';
import Login from './Login';
import Register from './Register';



function Landing(props){   

    return (
        <main className={styles.landing}>
            <section className={styles.content}>

                <div className={styles.nav}>
                    <div className={styles.nav__logo}>
                        <img className={styles.logo} src='/logo-primary.png' />
                        <h2>Advently</h2>
                    </div>
                    <div className={styles.nav__options}>
                        <Pressable content={<Register />}><p className={styles.nav__options__text}>Register</p></Pressable>
                        <Pressable content={<Login />}><p className={styles.nav__options__text}>Login</p></Pressable>
                    </div>
                </div>

                <div className={styles.title}><h1>Join a new </h1><h1>community with </h1><h1>Advently</h1></div>
                <p className={styles.content__para}>When you want to organise your friends or just search your local area for anything and everything happening.</p>
                <Pressable content={<Register />}><div className={styles.action}>Get Started</div></Pressable>

                <div className={styles.apps}>
                    <small>Available in</small>
                    <div>
                        <a target="_blank" href="https://apps.apple.com/gb/app/advently/id1571504549"><img src="/app-store-badge.png" /></a>
                        <a target="_blank" href="https://play.google.com/store/apps/details?id=com.fuzzycreations.advently"><img src="/google-play-badge.png" /></a>
                    </div>
                </div>

            </section>

            <section className={styles.images}>
                <div className={styles.images__apple}></div>
                <div className={styles.images__google}></div>
            </section>
        </main>
    )
}

export default Landing;


{/* <main className={styles.main} style={{height: "100vh"}}>
            <section className={styles.container}>

                <div className={styles.wrapper}>
                    <h3 class="medium">Welcome to</h3>
                    <img src='/logo-primary.png' />
                    <h1>Advently (Beta)</h1>
                </div>

                <div className={styles.wrapper}>
                    <Button_Main action={() => props.history.push('/register')}>Create Account</Button_Main>
                    <p class="medium">By signing up you are agreeing to Advently's terms and conditions</p>
                </div>

                <div className={styles.app_wrapper}>
                    <a href="https://apps.apple.com/gb/app/advently/id1571504549"><img className={styles.image} src="/app-store-badge.png" /></a>
                    <a href="https://play.google.com/store/apps/details?id=com.fuzzycreations.advently"><img className={styles.image} src="/google-play-badge.png" /></a>
                </div>

                <div className={styles.wrapper}>
                    <p class="medium">Already have an account? <span class="bold light"><Link to="/login">Login</Link></span></p>
                </div>
            </section>
        </main> */}