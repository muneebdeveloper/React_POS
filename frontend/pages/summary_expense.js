import React from 'react';

import Summary_Expense from '../components/expense/summary/Summary_Expense';
import Intro from '../components/misc/Intro';


const Add_Expense_Page = ()=>{
    return(
        <div className="mainpage">
            <Intro>Summary Expense</Intro>
            <Summary_Expense />
        </div>
    )
}

export default Add_Expense_Page;