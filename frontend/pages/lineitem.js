import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import LineItem from '../components/stock/define/LineItem';

const LineItemPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <LineItem />
            </PleaseSignIn>
        </div>
    );
}

export default LineItemPage;