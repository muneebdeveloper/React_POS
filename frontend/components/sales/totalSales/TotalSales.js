import React from 'react';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

import styles from '../../main.css';

const TotalSales = ()=>{
    return(
        <div className="gutterbottom">
            <Intro>
                Total Sales
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/sales_total">
                    <span>Icon</span>
                    Total Sales
                </Block>
            </div>
        </div>
    );
}


export default TotalSales;