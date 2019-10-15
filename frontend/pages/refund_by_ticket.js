import React from 'react';

import Intro from '../components/misc/Intro';
import Refund_By_Ticket from '../components/refund/byticket/Refund_By_Ticket';
import PleaseSignIn from '../components/PleaseSignIn';



const Refund_By_Ticket_page = ()=>{
    return(
        <div className="mainpage">
            <PleaseSignIn>
               <Intro>Refund by Ticket number</Intro>
               <Refund_By_Ticket />
            </PleaseSignIn>
        </div>
    )
}

export default Refund_By_Ticket_page;