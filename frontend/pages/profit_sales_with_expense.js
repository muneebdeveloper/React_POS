import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Profit_Sales_With_Expense from '../components/sales/salesWithExpense/Profit_Sales_With_Expense';


const Profit_Sales_With_Expense_Page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Profit_Sales_With_Expense />
            </PleaseSignIn>
        </div>
    );
}


export default Profit_Sales_With_Expense_Page;
