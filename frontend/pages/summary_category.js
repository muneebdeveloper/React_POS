import React from 'react';

import Intro from  '../components/misc/Intro';


import PleaseSignIn from '../components/PleaseSignIn';
import CategorySummary from '../components/stock/summary/categorysummary/CategorySummary';

const Summary_Category_Page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Intro>Category Summary</Intro>
                <CategorySummary />
            </PleaseSignIn>
        </div>
    );
}


export default Summary_Category_Page;