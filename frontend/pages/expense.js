import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import ExpenseAdd from '../components/expense/add/ExpenseAdd';
import ExpenseSummary from '../components/expense/summary/ExpenseSummary';


const ExpensePage = ()=>{
    return(
        <div class="mainpage">
            <PleaseSignIn>
                <ExpenseAdd />
                <ExpenseSummary />
            </PleaseSignIn>
        </div>
    )
}

export default ExpensePage;