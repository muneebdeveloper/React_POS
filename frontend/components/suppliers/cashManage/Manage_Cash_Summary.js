import React, {Component} from 'react';
import {Query,Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import Intro from '../../misc/Intro';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

import styles from './Manage_Cash_Summary.css';

import Manage_Cash_Summary_Table from './Manage_Cash_Summary_Table';


const SUPPLIER_PAID_DETAILS = gql`
    query SUPPLIER_PAID_DETAILS($id:ID!){
        supplier(
            where:{
                id:$id
            }
        ){
            name
            amounttopay
            amounttotake
            paid{
                createdAt
                description
                amounttopay
                amountpaid
                amountlefttopay
                amounttotake
                amounttaken
                amountlefttotake
            }
        }
    }
`;

const UPDATE_SUPPLIER_AMOUNTPAY_MUTATION = gql`
    mutation UPDATE_SUPPLIER_AMOUNTPAY_MUTATION($id:ID!, $amounttopay:Float!){
        updateSupplier(
            where:{id:$id},
            data:{amounttopay:$amounttopay}
        ){
            name
        }
    }
`;

const UPDATE_SUPPLIER_AMOUNTTAKE_MUTATION = gql`
    mutation UPDATE_SUPPLIER_AMOUNTPAY_MUTATION($id:ID!, $amounttotake:Float!){
        updateSupplier(
            where:{id:$id},
            data:{amounttotake:$amounttotake}
        ){
            name
        }
    }
`;


const CREATE_PAID_DETAIL_MUTATION = gql`
    mutation CREATE_PAID_DETAIL_MUTATION(
        $description:String,
        $amounttopay:Float,
        $amountpaid:Float!,
        $amountlefttopay:Float,
        $amounttotake:Float,
        $amounttaken:Float,
        $amountlefttotake:Float,
        $id:ID!
        ){
        createPaidDetail(
            data:{
                description:$description,
                amounttopay:$amounttopay,
                amountpaid:$amountpaid,
                amountlefttopay:$amountlefttopay,
                amounttotake:$amounttotake,
                amounttaken:$amounttaken,
                amountlefttotake:$amountlefttotake,
                supplier:{
                    connect:{
                        id:$id
                    }
                }
            }
        ){
            createdAt
        }
    }
`;

class Manage_Cash_Summary extends Component{

    state={
        toggleAmountOpen:false,
        toggleReceiveOpen:false,
        payDialog:'',
        payReceiveDialog:'',
        AmountToPay:'',
        AmountToTake:'',
        amountValue:'',
        receiveDescription:'',
        receiveValue:''
    }

    toggleAmountDialog = (value,type)=>()=>{
        
        if(type==='pay'){
            this.setState({
                toggleAmountOpen:value,
                payDialog:true
            });
            return;
        }
        if(type==='take'){
            this.setState({
                toggleAmountOpen:value,
                payDialog:false
            });
            return;
        }
        this.setState({
            toggleAmountOpen:value,
        })
    }

    toggleReceiveDialog = (value,type)=>()=>{
        
        if(type==='pay'){
            this.setState({
                toggleReceiveOpen:value,
                payReceiveDialog:true
            });
            return;
        }
        if(type==='take'){
            this.setState({
                toggleReceiveOpen:value,
                payReceiveDialog:false
            });
            return;
        }
        this.setState({
            toggleReceiveOpen:value,
        })
    }

    amountInputHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    amountReceiveHandler = (updateSupplier)=>async e=>{
        e.preventDefault();
        await updateSupplier();
        this.setState({
            toggleAmountOpen:false
        });
    }

    amountReceiptHandler = (createPaidDetail)=>async e=>{
        e.preventDefault();
        await createPaidDetail();
        this.setState({
            toggleReceiveOpen:false
        })
    }
    
    render(){
        const { toggleAmountOpen,
                toggleReceiveOpen,
                payDialog,
                amountValue,
                receiveDescription,
                receiveValue,
                payReceiveDialog,
                AmountToPay,
                AmountToTake
              } = this.state;
              
              
        return(
            <>
                <Intro>Supplier Cash Manage Summary</Intro>
                <Query 
                    query={SUPPLIER_PAID_DETAILS} 
                    variables={{id:this.props.id}}
                    onCompleted={({supplier})=>this.setState({
                        AmountToPay:supplier.amounttopay,
                        AmountToTake:supplier.amounttotake
                    })}
                    fetchPolicy='network-only'
                    >
                    {
                        ({data:{supplier},error,loading})=>{
                            if(loading){
                                return(
                                <div style={{display:"flex",justifyContent:"center"}}>
                                    <CircularProgress size={70} />
                                </div>
                                )
                            }
                         
                            
                            return(
                                <>
                                <h2>Supplier Name: {supplier.name}</h2>
                                <div style={{display:"flex",justifyContent:"space-evenly"}}>
                                    <div style={{textAlign:"center"}}>
                                        <h3>Amount to pay</h3>
                                        <div>{supplier.amounttopay}</div>
                                        <Button 
                                            variant="contained"
                                            onClick={this.toggleAmountDialog(true,"pay")}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    
                                    <div style={{textAlign:"center"}}>
                                        <h3>Amount to take</h3>
                                        <div>{supplier.amounttotake}</div>
                                        <Button 
                                            variant="contained"
                                            onClick={this.toggleAmountDialog(true,"take")}
                                        >
                                            Edit
                                        </Button>
                                    </div>

                                </div>
                                <div style={{display:"flex",justifyContent:"flex-end"}}>
                                    <Button 
                                        variant="contained"
                                        onClick={this.toggleReceiveDialog(true,"take")}
                                    >
                                        Take Now
                                    </Button>
                                    <Button 
                                        variant="contained"
                                        className={styles.checkred}
                                        onClick={this.toggleReceiveDialog(true,"pay")}
                                    >
                                        Pay Now
                                    </Button>
                                </div>
                                <table>
                                    <thead>
                                        <tr  style={{backgroundColor:'black',color:'white'}}>
                                            <th>Sr#</th>
                                            <th>Created At</th>
                                            <th>Description</th>
                                            <th>Amount to Pay</th>
                                            <th>Amount Paid</th>
                                            <th>Amount left to pay</th>
                                            <th>Amount to take</th>
                                            <th>Amount taken</th>
                                            <th>Amount left to take</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            supplier.paid.map((paidDetail,index)=>{
                                                const { createdAt,
                                                        description,
                                                        amounttopay,
                                                        amountpaid,
                                                        amountlefttopay,
                                                        amounttotake,
                                                        amounttaken,
                                                        amountlefttotake
                                                    } = paidDetail;
                                                return(
                                                <Manage_Cash_Summary_Table 
                                                    key={index}
                                                    sr={index+1} 
                                                    createdAt={createdAt.split("T").shift().split("-").reverse().join("-")}
                                                    description={description}
                                                    amounttopay={amounttopay}
                                                    amountpaid={amountpaid}
                                                    amountlefttopay={amountlefttopay}
                                                    amounttotake={amounttotake}
                                                    amounttaken={amounttaken}
                                                    amountlefttotake={amountlefttotake}
                                                />
                                                )
                                            }   
                                            )
                                        }
                                    </tbody>
                                </table>
                                </>
                            );
                        }
                    }
                </Query>
                <Dialog open={toggleAmountOpen} onClose={this.toggleAmountDialog(false)}>
                    <DialogTitle>
                        {
                            payDialog ? "Edit Pay Amount" : "Edit Take Amount"
                        }
                    </DialogTitle>
                    <Mutation 
                        awaitRefetchQueries
                        mutation={payDialog?UPDATE_SUPPLIER_AMOUNTPAY_MUTATION:UPDATE_SUPPLIER_AMOUNTTAKE_MUTATION} 
                        variables={payDialog?{id:this.props.id,amounttopay:Number(amountValue)}:{id:this.props.id,amounttotake:Number(amountValue)}}
                        refetchQueries={[{query:SUPPLIER_PAID_DETAILS,variables:{id:this.props.id}}]}    
                    >
                        {
                            (updateSupplier,{loading})=>{

                                if(loading){
                                    return(
                                        <div style={{padding:"8px 24px 20px",display:"flex",justifyContent:'center'}}>
                                                            <CircularProgress size={70} />
                                        </div>
                                    );
                                }

                                return(
                                    <form onSubmit={this.amountReceiveHandler(updateSupplier)}>
                                    <DialogContent>
                                      
                                        
                                        <TextField 
                                            label={payDialog ? "Amount to pay" : "Amount to take"}
                                            variant="outlined"
                                            type="number"
                                            name="amountValue"
                                            value={amountValue}
                                            onChange={this.amountInputHandler}
                                            required
                                            fullWidth
                                            autoFocus
                                            className={styles.marginbottom30}
                                        />
                
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                        variant="contained"
                                        type="submit"
                                        >
                                        {  payDialog ? "Change Pay Amount" : "Change Take Amount" }
                                        </Button>
                                    </DialogActions>
                                    </form>
                                );
                            }
                        }
                    </Mutation>
                   
                </Dialog>

                <Dialog open={toggleReceiveOpen} onClose={this.toggleReceiveDialog(false)} >

                    <DialogTitle>
                        {payReceiveDialog ? "Pay Amount" : "Take Amount"}
                    </DialogTitle>
                    

                    <Mutation
                        awaitRefetchQueries
                        mutation={CREATE_PAID_DETAIL_MUTATION}
                        variables={{
                            description:receiveDescription,
                            ...(payReceiveDialog?{
                                amounttopay:Number(AmountToPay),
                                amountpaid:Number(receiveValue),
                                amountlefttopay:Number(AmountToPay)-Number(receiveValue),
                                amounttotake:0,
                                amounttaken:0,
                                amountlefttotake:0
                            }:{
                                amounttotake:Number(AmountToTake),
                                amounttaken:Number(receiveValue),
                                amountlefttotake:Number(AmountToTake)-Number(receiveValue),
                                amounttopay:0,
                                amountpaid:0,
                                amountlefttopay:0
                            }),
                            id:this.props.id
                            }}
                        refetchQueries={
                            [
                                {
                                    query:SUPPLIER_PAID_DETAILS,
                                    variables:{
                                        id:this.props.id
                                    }
                                }
                            ]
                        }
                    >
                        {
                            (createPaidDetail,{loading})=>{

                                if(loading){
                                    return(
                                        <div style={{padding:"8px 24px 20px",display:"flex",justifyContent:'center'}}>
                                                            <CircularProgress size={70} />
                                        </div>
                                    );
                                }

                                return(
                                    <form onSubmit={this.amountReceiptHandler(createPaidDetail)}>
                                    <DialogContent>
                                    <TextField 
                                        label="Description"
                                        variant="outlined"
                                        name="receiveDescription"
                                        value={receiveDescription}
                                        required
                                        fullWidth
                                        autoFocus
                                        className={styles.marginbottom30}
                                        onChange={this.amountInputHandler}
                                    />
                                    <TextField 
                                        label="Amount"
                                        variant="outlined"
                                        name="receiveValue"
                                        value={receiveValue}
                                        required
                                        fullWidth
                                        className={styles.marginbottom30}
                                        onChange={this.amountInputHandler}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button 
                                            variant="contained"
                                            type="submit"
                                        >
                                            {payReceiveDialog ? "Pay Now":"Take Now"}
                                        </Button>
                                    </DialogActions>
                                </form>
            
                                )
                            }
                        }
                    </Mutation>

                   
                </Dialog>
            </>
        );
    }
}


export default Manage_Cash_Summary;

