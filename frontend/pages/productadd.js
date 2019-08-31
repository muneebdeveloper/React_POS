import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Intro from '../components/misc/Intro';
import ProductAddMain from '../components/stock/add/ProductAdd/index';



const ProductAddPage = ()=>{
    
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Intro>Add inventory</Intro>
                <ProductAddMain  />
            </PleaseSignIn>
        </div>
    );
}

export default ProductAddPage;