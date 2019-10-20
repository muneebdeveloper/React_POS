import React from 'react';

import Intro from '../components/misc/Intro';

import Generated from '../components/barcodes/Generated';


const BarcodesPage = ()=>{
    return(
        <div className="mainpage">
            <Intro>
                Generated Barcodes
            </Intro>
                <Generated />
        </div>
    )
}

export default BarcodesPage;