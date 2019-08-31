import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import RetailSales from '../components/shop/RetailSales';


const HomePage = ()=>{

    
        return(
            <div className="mainpage">
                <PleaseSignIn>
                    <RetailSales />
                </PleaseSignIn>
            </div>
        )
    
}



export default HomePage;