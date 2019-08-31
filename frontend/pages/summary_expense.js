import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Summary_Expense from '../components/expense/summary/Summary_Expense';
import Intro from '../components/misc/Intro';


const Add_Expense_Page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Intro>Summary Expense</Intro>
                <Summary_Expense />
            </PleaseSignIn>
        </div>
    )
}

export default Add_Expense_Page;