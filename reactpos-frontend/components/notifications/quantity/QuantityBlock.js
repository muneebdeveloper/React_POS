import React from 'react';

import styles from '../../main.css';


import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const QuantityBlock = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>
                Product Quantity Notifications
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/quantity_notifications">
                    Quantity Notifications
                </Block>
            </div>
        </div>
    )
}

export default QuantityBlock;