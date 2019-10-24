import React, {Component} from 'react';

import styles from '../stock.css';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

const AuditBlock = ()=>{
    return(
    <div className="gutterbottom">
        <Intro>
            Audit
        </Intro>

        <div className={styles.boxFlex}>
            <Block LinkTo="/stock_audit">
                Audit
            </Block>
        </div>
    </div>
    );
}

export default AuditBlock;