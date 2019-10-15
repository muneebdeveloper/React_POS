import React from 'react';

import Intro from '../components/misc/Intro';

import PleaseSignIn from '../components/PleaseSignIn';
import Generated from '../components/barcodes/Generated';


const BarcodesPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
            <Intro>
                Generated Barcodes
            </Intro>
                <Generated />
            </PleaseSignIn>
        </div>
    )
}

export default BarcodesPage;