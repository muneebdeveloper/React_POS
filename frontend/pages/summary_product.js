import React from 'react';

import Intro from '../components/misc/Intro';
import ProductSummaryMain from '../components/stock/summary/productSummary/index';


const Summary_Product_Page = ()=>{

    return(
        <div className="mainpage">
            <Intro>Product Summary</Intro>
            <ProductSummaryMain />
        </div>
    );
}

export default Summary_Product_Page;