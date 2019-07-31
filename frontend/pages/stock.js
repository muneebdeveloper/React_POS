import React,{Component} from 'react';

import CreateStock from '../components/stock/create/CreateStock';

class StockPage extends Component{

    render(){

        return(
            <div class="mainstock">
                <CreateStock />
            </div>
        );
    }

}

export default StockPage;