import React from 'react';

import styles from '../../main.css';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const ExpiryDefine = ()=>{
    return(
        <div className="gutterbottom">
            <Intro>Define</Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/define_expiry">
                    <span>Icon</span>
                    Define expiry
                </Block>
            </div>
        </div>
    );
}

export default ExpiryDefine;