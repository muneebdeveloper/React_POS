import React from 'react';

import Intro from '../components/misc/Intro';
import Generated_Barcodes from '../components/barcodes/generated/Generated_Barcodes';
import PleaseSignIn from '../components/PleaseSignIn';



const BarcodesPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
               <Intro>Generated barcodes</Intro>
               <Generated_Barcodes />
            </PleaseSignIn>
        </div>
    )
}

export default BarcodesPage;