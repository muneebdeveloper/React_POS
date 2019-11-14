import React, {Component} from 'react';


import styles from '../stock.css';

import Intro from '../../misc/Intro';
import Block from '../../misc/Block';

class DefineStock extends Component{

    render(){

        return(
            <div className="gutterbottom">

                <Intro>Define</Intro>

                <div className={styles.boxFlex}>
       
                    <Block LinkTo="/lineitem">
                        LineItem
                     </Block>
                        
                     <Block LinkTo="/category">
                        Category
                    </Block>

                     <Block LinkTo="/product">
                        Product
                    </Block>
                </div>
           

            </div>
        );
    }

}

export default DefineStock;