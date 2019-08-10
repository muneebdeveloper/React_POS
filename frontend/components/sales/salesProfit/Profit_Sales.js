import React, {Component} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Intro from '../../misc/Intro';
import Button from '@material-ui/core/Button';


// const REQUIRED_SALES_PROFIT_LIST=gql`
//     query REQUIRED_SALES_PROFIT_LIST{
        
//     }
// `;

class Profit_Sales extends Component{

    render(){
        return(
            <>
                <Intro>Sales Profit</Intro>

                <form>
                    <label>
                        Choose start time
                        <input type="date" />
                    </label>

                    <label>
                        Choose end Time
                        <input type="date" />
                    </label>

                    <Button 
                        type="submit"
                        variant="contained"
                        // size="large"
                    >
                        Submit
                    </Button>
            
                </form>
            </>
        );
    }
}

export default Profit_Sales;