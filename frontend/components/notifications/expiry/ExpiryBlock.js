import React from 'react';

import styles from '../../main.css';


import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const ExpiryBlock = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>
                Expiry Notifications
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/expiry_notifications">
                    <span>Icon</span>
                    Expiry Details
                </Block>
            </div>
        </div>
    )
}

export default ExpiryBlock;