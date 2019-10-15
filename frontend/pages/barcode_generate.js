import React from 'react';

import Intro from '../components/misc/Intro';
import Generate_New_Barcodes from '../components/barcodes/generate_new/Generate_New_Barcodes';
import PleaseSignIn from '../components/PleaseSignIn';



const BarcodesPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
               <Intro>Generate barcodes</Intro>
               <Generate_New_Barcodes />
            </PleaseSignIn>
        </div>
    )
}

export default BarcodesPage;