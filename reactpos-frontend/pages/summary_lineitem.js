import React from 'react';

import Intro from  '../components/misc/Intro';

import LineItemSummary from '../components/stock/summary/lineitemsummary/LineItemSummary';

const Summary_LineItem_Page = ()=>{
    return(
        <div className="mainpage">
                <Intro>LineItem Summary</Intro>
                <LineItemSummary />
        </div>
    );
}


export default Summary_LineItem_Page;