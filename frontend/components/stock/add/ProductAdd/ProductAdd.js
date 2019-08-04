import React, {Component} from 'react';




class ProductAdd extends Component{


    render(){
        const {prochangeHandler,stockChangeHandler,productname,badge,buyprice,sellprice,wholesaleprice,noofpieces,expiry} = this.props;

        return(
            <form onSubmit={stockChangeHandler}>
                <label>Product Name:
                    <input type="text" value={productname} disabled />
                </label>
                <label>Badge Number:
                    <input type="text" value={badge} autoFocus={productname?true:false} onChange={prochangeHandler.bind(this,"badge")} />
                </label>
                <label>Buy Price:
                    <input type="number" value={buyprice} onChange={prochangeHandler.bind(this,"buyprice")} />
                </label>
                <label>Sell Price:
                <input type="number"  value={sellprice} onChange={prochangeHandler.bind(this,"sellprice")} />
                </label>
                <br />
                <br />
                <label>wholesale Price:
                <input type="number" value={wholesaleprice} onChange={prochangeHandler.bind(this,"wholesaleprice")} />
                </label>
                <label>Number of Pieces:
                <input type="number"  value={noofpieces} onChange={prochangeHandler.bind(this,"noofpieces")} />
                </label>
                <label>expiry:
                    <input type="date" value={expiry} onChange={prochangeHandler.bind(this,"expiry")} />
                </label>
                <button type="submit">Submit</button>
            </form>
        );
    }

}

export default ProductAdd;