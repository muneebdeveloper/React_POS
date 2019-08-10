import React from 'react';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

import styles from '../../main.css';

const SalesProfit = ()=>{
    return(
        <div className="gutterbottom">
            <Intro>
                Sales Profit
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/profit_sales">
                    <span>Icon</span>
                    Sales profit
                </Block>
            </div>
        </div>
    );
}


export default SalesProfit;