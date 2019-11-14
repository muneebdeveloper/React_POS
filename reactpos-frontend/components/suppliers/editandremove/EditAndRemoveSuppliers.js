import React from 'react';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

import styles from '../../main.css';

const EditAndRemoveSuppliers = ()=>{
    return(
        <div className="gutterbottom">

            <Intro>Edit / Remove</Intro>
            <div className={styles.boxFlex}>
                <Block LinkTo="suppliers_ed">
                    Edit and Remove
                </Block>
            </div>

        </div>

    )
}

export default EditAndRemoveSuppliers;