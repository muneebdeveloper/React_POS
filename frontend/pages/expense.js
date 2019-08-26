import React from 'react';

import ExpenseAdd from '../components/expense/add/ExpenseAdd';
import ExpenseSummary from '../components/expense/summary/ExpenseSummary';


const ExpensePage = ()=>{
    return(
        <div class="mainpage">
            <ExpenseAdd />
            <ExpenseSummary />
        </div>
    )
}

export default ExpensePage;