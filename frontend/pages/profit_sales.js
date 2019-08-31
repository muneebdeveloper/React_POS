import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';

import Intro from '../components/misc/Intro';

import Profit_Sales from '../components/sales/salesProfit/Profit_Sales';


const Profit_Sales_Page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Intro>Sales Profit</Intro>
                <Profit_Sales />
            </PleaseSignIn>
        </div>
    );
}


export default Profit_Sales_Page;
