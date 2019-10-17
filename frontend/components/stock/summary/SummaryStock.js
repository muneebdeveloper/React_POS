import React from 'react';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

import styles from '../stock.css';

const SummaryStock = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>Summary / Edit / Remove</Intro>
            <div className={styles.boxFlex}>

                <Block LinkTo="/summary_lineitem">
                    <span>Icon</span>
                    LineItem Summary
                </Block>

                <Block LinkTo="/summary_category">
                    <span>Icon</span>
                    Category Summary
                </Block>

                <Block LinkTo="/summary_product">
                    <span>Icon</span>
                    Product Summary
                </Block>

            </div>
        </div>
    );
}

export default SummaryStock;