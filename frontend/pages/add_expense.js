import React from 'react';

import Add_Expense from '../components/expense/add/Add_Expense';
import Intro from '../components/misc/Intro';


const Add_Expense_Page = ()=>{
    return(
        <div className="mainpage">
            <Intro>Add Expense</Intro>
            <Add_Expense />
        </div>
    )
}

export default Add_Expense_Page;