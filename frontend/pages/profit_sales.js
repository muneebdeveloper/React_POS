import React from 'react';

import Intro from '../components/misc/Intro';

import Profit_Sales from '../components/sales/salesProfit/Profit_Sales';


const Profit_Sales_Page = ()=>{
    return(
        <div className="mainpage">
                <Intro>Sales Profit</Intro>
                <Profit_Sales />
        </div>
    );
}


export default Profit_Sales_Page;
