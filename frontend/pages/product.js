import React from 'react';
import {useRouter} from 'next/router';

import PleaseSignIn from '../components/PleaseSignIn';
import Intro from '../components/misc/Intro';
import Product from '../components/stock/define/Product';


const productPage = ()=>{

    const router = useRouter();

    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Intro>Define a product</Intro>
                <Product isMain={router.pathname==='/product'?true:false} />
            </PleaseSignIn>
        </div>
    );
}

export default productPage;