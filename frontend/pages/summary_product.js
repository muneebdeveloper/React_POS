import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Intro from '../components/misc/Intro';
import ProductSummaryMain from '../components/stock/summary/productSummary/index';


const Summary_Product_Page = ()=>{

    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Intro>Product Summary</Intro>
                <ProductSummaryMain />
            </PleaseSignIn>
        </div>
    );
}

export default Summary_Product_Page;