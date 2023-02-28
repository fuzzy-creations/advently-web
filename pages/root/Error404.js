import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button_Main from '../../components/buttons/Button_Main';
import styles from '../../styles/pages/root/Fallback.module.scss';

function Error404(props){
    const navigate = useNavigate();
    
    return (
       <main className={styles.fallback}>
            <h1>404</h1>
            <h5>Page not found.</h5>
            <Button_Main action={() => navigate("/")} size={"20rem"}>Go Home</Button_Main>
       </main>
    )
}

export default Error404;