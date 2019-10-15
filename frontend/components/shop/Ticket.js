import React,{Component} from 'react';
import styles from './Ticket.css';

class Ticket extends Component {

    render(){
        const{ticket,date,subTotal,quantity,discount,netTotal} = this.props;
        
        return(
            <div style={{display:"flex",flexFlow:"column",alignItems:"center",fontSize:"13px"}}>
                <div style={{display:"flex",flexFlow:"column",alignItems:"center",marginTop:"35px"}}>
                    <span>Purchase Slip</span>
                    <span>Chaudhry General Store</span>
                    <span>Near Shaheen Chowk Opp Hamid Ali Shah</span>
                    <span>Masjid Sargodha</span>
                    <span>048-3728028</span>
                </div>
                <div style={{display:"flex",flexFlow:"column",alignItems:"center",marginTop:"10px",marginBottom:"30px"}}>
                    <span style={{marginLeft:"-50px"}}>Ticket Number: {ticket} </span>
                    <span style={{marginLeft:"-50px"}}>Date: {date}</span>
                </div>
                <table className={styles.tableStyles}>
                   
                    <thead>
                   
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.receipt.map((r,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{r.product}</td>
                                        <td>{r.price}</td>
                                        <td>{r.quantity}</td>
                                        <td>{r.value()}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr style={{borderTop:"2px dotted"}}>
                            <td colSpan={2} style={{textAlign:"right",paddingRight:"40px"}}>SubTotal</td> 
                            <td>{quantity}</td>
                            <td>{subTotal}</td>  
                        </tr> 
                        <tr style={{fontSize:"15px",fontWeight:"bold"}}>
                            <td colSpan={2} style={{textAlign:"right",paddingRight:"40px"}}>Discount</td> 
                            <td colSpan={2} style={{textAlign:"center",paddingRight:"45px"}}>{discount}</td>                 
                        </tr> 
                        <tr style={{fontSize:"18px",fontWeight:"bold"}}>
                            <td colSpan={2} style={{textAlign:"right",paddingRight:"40px"}}>Net Total</td> 
                            <td colSpan={2} style={{textAlign:"center",paddingRight:"45px"}}>{netTotal}</td>        
                        </tr> 
                    </tfoot>
                </table>
                <div style={{display:"flex",flexFlow:"column",alignItems:"center",marginTop:"10px",marginBottom:"30px"}}>
                    <span style={{marginLeft:"-150px"}}>Terms & Conditions  </span>
                    <span style={{marginLeft:"-100px"}}>1) No Exchange without bill</span>
                    <span style={{marginLeft:"5px"}}>2) No Exchange no refund of imported products</span>
                    <span style={{marginLeft:"-100px"}}>3) Exchange within 03 days</span>
                </div>
               
            </div>
        )
    }
} 

export default Ticket;