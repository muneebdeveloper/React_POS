import React from 'react';

import styles from '../../main.css';


import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const ExpenseAdd = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>
                Add
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/add_expense">
                    <span>Icon</span>
                    Add Expense
                </Block>
            </div>
        </div>
    )
}

export default ExpenseAdd;