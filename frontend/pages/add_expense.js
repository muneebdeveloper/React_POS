import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Add_Expense from '../components/expense/add/Add_Expense';
import Intro from '../components/misc/Intro';


const Add_Expense_Page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Intro>Add Expense</Intro>
                <Add_Expense />
            </PleaseSignIn>
        </div>
    )
}

export default Add_Expense_Page;