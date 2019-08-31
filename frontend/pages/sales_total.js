import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Sales_Total from '../components/sales/totalSales/Sales_Total';


const Total_Sales_Page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Sales_Total />
            </PleaseSignIn>
        </div>
    );
}


export default Total_Sales_Page;
