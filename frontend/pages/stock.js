import React,{Component} from 'react';

import CreateStock from '../components/stock/create/CreateStock';
import AddStock from '../components/stock/add/AddStock';

class StockPage extends Component{

    render(){

        return(
            <div class="mainpage">
                <CreateStock />
                <AddStock />
            </div>
        );
    }

}

export default StockPage;