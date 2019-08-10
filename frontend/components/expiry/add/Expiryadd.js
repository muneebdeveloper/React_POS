import React from 'react';

import styles from '../../main.css';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const ExpiryAdd = ()=>{
    return(
        <div className="gutterbottom">
            <Intro>Add</Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/add_expiry">
                    <span>Icon</span>
                    Add expiry
                </Block>
            </div>
        </div>
    );
}

export default ExpiryAdd;