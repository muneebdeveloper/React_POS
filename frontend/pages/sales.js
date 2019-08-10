import React from 'react';

import SalesProfit from '../components/sales/salesProfit/SalesProfit';
import TotalSales from '../components/sales/totalSales/TotalSales';
import SalesWithExpense from '../components/sales/salesWithExpense/SalesWithExpense';

const SalesPage = ()=>{
    return(
        <div className="mainpage">
            <SalesProfit />
            <TotalSales />
            <SalesWithExpense />
        </div>
    );
}


export default SalesPage;