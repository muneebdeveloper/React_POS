import React, {Component} from 'react';

import styles from '../stock.css';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

const AddStock = ()=>{
    return(
    <div className="gutterbottom">
        <Intro>
            Add
        </Intro>

        <div className={styles.boxFlex}>
            <Block LinkTo="/productadd">
                Add Inventory
            </Block>
        </div>
    </div>
    );
}

export default AddStock;