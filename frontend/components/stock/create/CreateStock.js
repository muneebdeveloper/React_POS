import React, {Component} from 'react';


import styles from '../stock.css';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

class CreateStock extends Component{

    render(){

        return(
            <div className="gutterbottom">

                <Intro>Define</Intro>

                <div className={styles.boxFlex}>
       
                    <Block LinkTo="/lineitem">
                        <span>icon</span>
                        LineItem
                     </Block>
                        
                     <Block LinkTo="/category">
                        <span>icon</span>
                        LineItem
                    </Block>

                     <Block LinkTo="/product">
                        <span>icon</span>
                        LineItem
                    </Block>
                </div>
           

            </div>
        );
    }

}

export default CreateStock;