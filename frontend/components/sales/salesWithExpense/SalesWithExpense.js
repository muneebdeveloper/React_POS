import React from 'react';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

import styles from '../../main.css';

const SalesWithExpense = ()=>{
    return(
        <div className="gutterbottom">
            <Intro>
                Sales With Expense
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/profit_sales_with_expense">
                    <span>Icon</span>
                    Sales With Expense
                </Block>
            </div>
        </div>
    );
}


export default SalesWithExpense;