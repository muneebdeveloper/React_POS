import React from 'react';

import styles from '../../main.css';


import Intro from '../../misc/Intro';
import Block from '../../misc/Block';


const BySearch = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>
                Refund By Search
            </Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/refund_by_search">
                    <span>Icon</span>
                    Refund By Search
                </Block>
            </div>
        </div>
    )
}

export default BySearch;