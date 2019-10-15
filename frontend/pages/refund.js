import React from 'react';

import PleaseSignIn from '../components/PleaseSignIn';
import ByTicket from '../components/refund/byticket/ByTicket';
import BySearch from '../components/refund/bysearch/BySearch';


const RefundPage = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
                <ByTicket />
                <BySearch />
            </PleaseSignIn>
        </div>
    )
}

export default RefundPage;