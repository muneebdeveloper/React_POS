import React,{Component} from 'react';

import DefineStock from '../components/stock/define/DefineStock';
import AddStock from '../components/stock/add/AddStock';
import SummaryStock from '../components/stock/summary/SummaryStock'; 

class StockPage extends Component{

    render(){

        return(
            <div className="mainpage">
                    <DefineStock />
                    <AddStock />
                    <SummaryStock />
            </div>
        );
    }

}

export default StockPage;