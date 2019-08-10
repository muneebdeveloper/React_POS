import React, {Component} from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Intro from '../../misc/Intro';
import Button from '@material-ui/core/Button';


class Sales_Total extends Component{

    render(){
        return(
            <>
                <Intro>Total Sales</Intro>

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

export default Sales_Total;