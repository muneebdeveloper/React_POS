import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import SalesProfit from '../components/sales/salesProfit/SalesProfit';
import TotalSales from '../components/sales/totalSales/TotalSales';
import SalesWithExpense from '../components/sales/salesWithExpense/SalesWithExpense';

const SalesPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <SalesProfit />
                <TotalSales />
                <SalesWithExpense />
            </PleaseSignIn>
        </div>
    );
}


export default SalesPage;