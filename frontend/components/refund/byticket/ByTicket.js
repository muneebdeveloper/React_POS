import React from 'react';

import styles from '../../main.css';


import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const ByTicket = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>
                Refund By Ticket Number
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/refund_by_ticket">
                    <span>Icon</span>
                    Refund By Ticket
                </Block>
            </div>
        </div>
    )
}

export default ByTicket;