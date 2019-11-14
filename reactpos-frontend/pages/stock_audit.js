import React from 'react';

import Intro from '../components/misc/Intro';

import StockAudit from '../components/stock/audit/StockAudit';

const StockAuditPage = ()=>{

    return(
        <div className="mainpage">
            <Intro>Stock Audit</Intro>
            <StockAudit />
        </div>
    );

}


export default StockAuditPage;