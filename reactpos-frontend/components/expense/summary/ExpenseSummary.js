import React from 'react';

import styles from '../../main.css';


import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const ExpenseAdd = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>
                Summary
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/summary_expense">
                    Expense Summary
                </Block>
            </div>
        </div>
    )
}

export default ExpenseAdd;