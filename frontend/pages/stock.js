import React,{Component} from 'react';

import CreateStock from '../components/stock/create/CreateStock';
import AddStock from '../components/stock/add/AddStock';
import SummaryStock from '../components/stock/summary/SummaryStock'; 

class StockPage extends Component{

    render(){

        return(
            <div class="mainpage">
                <CreateStock />
                <AddStock />
                <SummaryStock />
            </div>
        );
    }

}

export default StockPage;