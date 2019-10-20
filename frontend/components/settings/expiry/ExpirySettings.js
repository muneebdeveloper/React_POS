import React from 'react';

import styles from '../../main.css';


import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const ExpirySettings = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>
                Expiry Settings
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/expiry_settings">
                    <span>Icon</span>
                    Expiry Settings
                </Block>
            </div>
        </div>
    )
}

export default ExpirySettings;