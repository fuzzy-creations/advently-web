import React from 'react';
import Footer from '../../components/UI/Footer';

function Construction() {
    return (
        <>
        <div>
            <h1>Advently is under reconstruction</h1>
            <h3>We'll be back soon</h3>
            <div>
                <a href="https://apps.apple.com/gb/app/advently/id1571504549"><img className={{width: "15rem", marginRight: "2rem"}} src="/app-store-badge.png" /></a>
                <a href="https://play.google.com/store/apps/details?id=com.fuzzycreations.advently"><img className={{width: "15rem", marginRight: "2rem"}} src="/google-play-badge.png" /></a>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default Construction;