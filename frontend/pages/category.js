import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import Category from '../components/stock/define/Category';

const CategoryPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <Category />
            </PleaseSignIn>
        </div>
    );
}

export default CategoryPage;