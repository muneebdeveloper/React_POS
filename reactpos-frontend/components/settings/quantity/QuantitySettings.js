import React from 'react';

import styles from '../../main.css';


import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const QuantitySettings = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>
                Quantity Settings
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/quantity_settings">
                    Quantity Settings
                </Block>
            </div>
        </div>
    )
}

export default QuantitySettings;