import React,{Component} from 'react';

import PleaseSignIn from '../components/PleaseSignIn';

import DefineStock from '../components/stock/define/DefineStock';
import AddStock from '../components/stock/add/AddStock';
import SummaryStock from '../components/stock/summary/SummaryStock'; 

class StockPage extends Component{

    render(){

        return(
            <div class="mainpage">
                <PleaseSignIn>
                    <DefineStock />
                    <AddStock />
                    <SummaryStock />
                </PleaseSignIn>
            </div>
        );
    }

}

export default StockPage;