import React from 'react';

import Intro from  '../components/misc/Intro';


import PleaseSignIn from '../components/PleaseSignIn';
import LineItemSummary from '../components/stock/summary/lineitemsummary/LineItemSummary';

const Summary_LineItem_Page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Intro>LineItem Summary</Intro>
                <LineItemSummary />
            </PleaseSignIn>
        </div>
    );
}


export default Summary_LineItem_Page;