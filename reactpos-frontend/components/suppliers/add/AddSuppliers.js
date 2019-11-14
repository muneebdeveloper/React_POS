import React, {Component} from 'react';

import styles from '../../main.css';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

const AddSuppliers = ()=>{

    return(
        <div className="gutterbottom">
            <Intro>Add</Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="/suppliers_add">
                    Add Suppliers
                </Block>
            </div>
        </div>
    )
}

export default AddSuppliers;
