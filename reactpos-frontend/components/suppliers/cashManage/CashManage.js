import React from 'react';

import styles from '../../main.css';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

const CashManage = ()=>{
    return(
        <div className="gutterbottom">
            <Intro>Cash Manager</Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/supplier_manage_cash">
                    Cash Management
                </Block>
            </div>
        </div>
    );
}

export default CashManage;