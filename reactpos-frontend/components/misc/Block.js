import React from 'react';
import styles from './Block.css';
import Link from 'next/link';


const Block = (props)=>{
    return(
        <Link href={props.LinkTo}>
        <a className={styles.blockahref}>
            <div className={styles.block}>
                <h3>{props.children}</h3>
            </div>
        </a>
        </Link>
    );
}

export default Block;