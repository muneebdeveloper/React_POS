import React from 'react';
import styles from './Intro.css';


const Intro = (props)=>{

    return(
        <h1 className={styles.h1}>
            {props.children}
        </h1>
    );
}

export default Intro;