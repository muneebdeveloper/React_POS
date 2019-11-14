import React from 'react';

import Intro from  '../components/misc/Intro';

import CategorySummary from '../components/stock/summary/categorysummary/CategorySummary';

const Summary_Category_Page = ()=>{
    return(
        <div className="mainpage">
                <Intro>Category Summary</Intro>
                <CategorySummary />
        </div>
    );
}


export default Summary_Category_Page;