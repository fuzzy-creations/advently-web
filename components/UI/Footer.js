import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/UI/Footer.module.scss';

function Footer() {
    return (
        <div className={styles.container}>
            <p class="light"><Link to="/terms">Terms and Conditions</Link></p>
            <p class="light"><Link to="/privacy">Privacy Policy</Link></p>
            <p class="light"><Link to="/contact">Contact Us</Link></p>
        </div>
    )
}

export default Footer;