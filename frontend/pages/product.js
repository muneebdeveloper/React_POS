import React from 'react';

import Intro from '../components/misc/Intro';
import Product from '../components/stock/define/Product';


const productPage = ()=>{

    return(
        <div className="mainpage">
            <Intro>Define a product</Intro>
            <Product />
        </div>
    );
}

export default productPage;