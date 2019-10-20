import React from 'react';

import Intro from '../components/misc/Intro';
import ProductAddMain from '../components/stock/add/ProductAdd/index';



const ProductAddPage = ()=>{
    
    return(
        <div className="mainpage">
                <Intro>Add inventory</Intro>
                <ProductAddMain  />
        </div>
    );
}

export default ProductAddPage;