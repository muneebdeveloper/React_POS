import React, {Component} from 'react';

import Intro from '../misc/Intro';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import Delete from '@material-ui/icons/Delete';
import PanTool from '@material-ui/icons/PanTool';
import ShoppingCart from '@material-ui/icons/ShoppingCart'

import styles from './RetailSales.css';

class RetailSales extends Component{

    constructor(props){
        super(props);

        this.inputFieldRef = React.createRef();
    }

    componentDidMount(){
        this.inputFieldRef.current.focus();
        
    }

    

    render(){
        return(
            <>
            <Intro>
                Retail Sales
            </Intro>
            <div className={`gutterbottom ${styles.maintoolbar}`}>

            <form>
                <div className={styles.mainfirst}>
                    
                <TextField 
                    label="Product Code"
                    variant="outlined"
                    inputRef={this.inputFieldRef}
                    className={styles.mainfirstgrow}
                />
                <Button
                    variant="contained"
                    >
                        submit
                    </Button>
                </div>
            </form>
                <div className={styles.mainsecond}>
                <Button
                    variant="contained"
                    >
                        <Search className={styles.marginRight} />
                        Search Product
                    </Button>
                    <Button
                    variant="contained"
                    >
                        <PanTool className={styles.marginRight} />
                        Hold Receipt
                    </Button>

                    <Button
                    variant="contained"
                    >
                        
                        <Badge badgeContent={2} color="secondary">
                            <ShoppingCart className={styles.marginRight} />
                        </Badge> 
                        
                       
                           
                        Holded Receipt
                    </Button>

                    <Button
                    variant="contained"
                    className={styles.red}
                    >
                        <Delete />
                        Delete Receipt
                    </Button>
                    </div>

            </div>
            <div style={{height:"301px",overflowY:"auto",border:"2px solid black"}} className="gutterbottom">
            <table >
                <thead>
                    <tr>
                        <th>Sr#</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                
            
                <tbody>
                    
                
         
                    
                    
                </tbody>
               
            </table>
            </div>
            
            <div className="gutterbottom" style={{display:"flex",justifyContent:"center",position:"relative"}}>
                <div className={styles.aligncenter}>
                    <h1 style={{color:"green"}}>SubTotal</h1>
                    <h2>56</h2>
                </div>

                <div style={{marginRight:"100px",marginLeft:"100px"}} className={styles.aligncenter}>
                    <h1 style={{color:"red"}}>Discount</h1>
                    <input type="number" value="0" style={{width:"130px",fontSize:"25px",textAlign:"center"}} />
                </div>

                <div className={styles.aligncenter}>
                    <h1 >Total</h1>
                    <h2>56</h2>
                </div>
                <Button
                    variant="contained"
                    className={styles.buttonsetting}
                    size="large"
                    >
                        Print receipt
                    </Button>
            </div>
            
            </>
        )
    }
}


export default RetailSales;