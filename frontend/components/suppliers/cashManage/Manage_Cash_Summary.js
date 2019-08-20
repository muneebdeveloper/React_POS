import React, {Component} from 'react';
import {Query,Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import Intro from '../../misc/Intro';
import ErrorDialog from '../../misc/ErrorDialog';
import SnackBar from '../../misc/SnackBar';
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
                amountpaid
                amounttaken
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
        $amountpaid:Float!,
        $amounttaken:Float,
        $id:ID!
        ){
        createPaidDetail(
            data:{
                description:$description,
                amountpaid:$amountpaid,
                amounttaken:$amounttaken,
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
        payDialog:null,
        payReceiveDialog:null,
        amountToPay:'',
        amountToTake:'',
        receiveDescription:'',
        receiveToPay:'',
        receiveToTake:'',
        snackbarOpen:false,
        snackbarMessage:'',
        errorDialogOpen:false,
        errorDialogMessage:''
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
                receiveDescription,
                receiveToPay,
                receiveToTake,
                payReceiveDialog,
                amountToPay,
                amountToTake,
                snackbarOpen,
                snackbarMessage,
                errorDialogOpen,
                errorDialogMessage
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
                        ({data,loading})=>{

                            if(loading){
                                return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                                )
                            }

                            if(errorDialogOpen){
                                return(
                                    <ErrorDialog dialogValue={errorDialogOpen} dialogClose={()=>this.setState({errorDialogOpen:false})}>
                                        {errorDialogMessage}
                                    </ErrorDialog>
                                )
                            }
                         
                            
                            return(
                                <>
                                <h2 style={{color:'#736464',marginBottom:'30px'}}>Supplier Name: {data.supplier.name}</h2>

                                <div className="gutterbottomsmall">

                                    <div className={`${styles.mainFlexStyling} gutterbottomsmall`}>

                                        <div className={styles.mainFlexStylingChild}>
                                            <h3>Amount to pay</h3>
                                            <span>{data.supplier.amounttopay}</span>
                                            <Button 
                                                variant="contained"
                                                onClick={this.toggleAmountDialog(true,"pay")}
                                                size="small"
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    
                                    <div className={styles.mainFlexStylingChild}>
                                        <h2>Amount to take</h2>
                                        <div>{data.supplier.amounttotake}</div>
                                        <Button 
                                            variant="contained"
                                            onClick={this.toggleAmountDialog(true,"take")}
                                            size="small"
                                        >
                                            Edit
                                        </Button>
                                    </div>

                                </div>
                                <DialogActions>
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
                                </DialogActions>
                                </div>
                                <table>
                                    <thead>
                                        <tr  style={{backgroundColor:'black',color:'white'}}>
                                            <th>Sr#</th>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Amount Paid</th>
                                            <th>Amount taken</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {   data.supplier.paid &&
                                            data.supplier.paid.map((paidDetail,index)=>{
                                                const { createdAt,
                                                        description,
                                                        amountpaid,
                                                        amounttaken,
                                                    } = paidDetail;
                                                return(
                                                <Manage_Cash_Summary_Table 
                                                    key={index}
                                                    sr={index+1} 
                                                    createdAt={createdAt.split("T").shift().split("-").reverse().join("-")}
                                                    description={description}
                                                    amountpaid={amountpaid}
                                                    amounttaken={amounttaken}
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
                        variables={payDialog?{id:this.props.id,amounttopay:Number(amountToPay)}:{id:this.props.id,amounttotake:Number(amountToTake)}}
                        refetchQueries={[{query:SUPPLIER_PAID_DETAILS,variables:{id:this.props.id}}]}
                        onCompleted={
                            ()=>{
                                let message;
                                if(payDialog){
                                    message = "Supplier Amount to pay is successfully updated"
                                }else{
                                    message = "Supplier Amount to take is successfully updated"
                                }
                                this.setState({
                                    snackbarOpen:true,
                                    snackbarMessage:message
                                })
                            }
                        }
                        onError = {
                            ()=>{
                                this.setState({
                                    errorDialogOpen:true,
                                    errorDialogMessage:"Something went wrong"
                                })
                            }
                        }
                    >
                        {
                            (updateSupplier,{loading})=>{

                                if(loading){
                                    return(
                                        <div className="dialogLoadingStyle">
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
                                            name={payDialog ? "amountToPay" : "amountToTake"}
                                            value={payDialog ? amountToPay : amountToTake}
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
                                amountpaid:Number(receiveToPay),
                                amounttaken:null,
                            }:{
                                amounttaken:Number(receiveToTake),
                                amountpaid:null
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
                                        name={payReceiveDialog?"receiveToPay":"receiveToTake"}
                                        value={payReceiveDialog?"receiveToPay":"receiveToTake"}
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
                <SnackBar snackbarValue={snackbarOpen} snackbarClose={()=>this.setState({snackbarOpen:false})}>
                    {snackbarMessage}
                </SnackBar>
            </>
        );
    }
}


export default Manage_Cash_Summary;

