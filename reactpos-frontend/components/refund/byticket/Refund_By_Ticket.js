import React,{Component} from 'react';
import gql from 'graphql-tag';
import {ApolloConsumer,Mutation} from 'react-apollo';
import Router from 'next/router';

import ErrorDialog from '../../misc/ErrorDialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Cancel from '@material-ui/icons/Cancel';

import styles from '../../main.css';

import Refund_By_Ticket_Table from './Refund_By_Ticket_Table';

const SALESTICKET_QUERY = gql`
    query SALESTICKET_QUERY($ticket:String!){
        salesTicket(where:{receipt:$ticket}){
            id
            sales{
                id
                noofpieces
                priceSold
                product{
                    name
                }
            }
        }
    }
`;

const REFUNDITEMS_MUTATION = gql`
    mutation REFUNDITEMS_MUTATION($id:String!,$quantity:Int!){
        refundItems(data:{salesitemID:$id,noofpieces:$quantity})
    }
`;


class Refund_By_Ticket extends Component{

    state={
        ticket:'',
        ticketLoading:false,
        refundQuantity:'',
        index:null,
        salesArray:[],
        refundObject:[],
        dialogRefundQuantity:false,
        errorDialog:false,
        errorInfo:'something went wrong',
        refundAmountDialog:false,
        refundAmount:0
    }

    inputChangeHandler = (e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    
    ticketSubmitHandler = (client)=>async (e)=>{
        e.preventDefault();
        this.setState({
            ticketLoading:true,
            salesArray:[],
            refundQuantity:[],
            refundQuantity:''
        })
        try{
            let res=await client.query({
                    query:SALESTICKET_QUERY,
                    variables:{
                        ticket:this.state.ticket
                    },
                    fetchPolicy:'network-only'
                }
                );
                
            if(!res.data.salesTicket){
                this.setState({
                    errorDialog:true,
                    errorInfo:"The ticket number is incorrect",
                    ticketLoading:false,
                    refundQuantity:'',
                    index:null,
                    salesArray:[],
                    refundObject:[],
                    dialogRefundQuantity:false,
                })
            }else{
                this.setState({
                    ticketLoading:false,
                    salesArray:[...res.data.salesTicket.sales],
                    refundQuantity:'',
                    index:null,
                    refundObject:[],
                    dialogRefundQuantity:false,
                    errorDialog:false,
                    errorInfo:'something went wrong',
                })
            }
        }catch(err){
            this.setState({
                errorDialog:true,
                ticketLoading:false
            })
        }
    }

    refundByQuantity=(index)=>{
        
        this.setState({
            dialogRefundQuantity:true,
            index
        });

    }

    refundAll=(index,id)=>{
        
        let requiredArray = JSON.parse(JSON.stringify(this.state.salesArray));
        let requiredRefundArray = JSON.parse(JSON.stringify(this.state.refundObject));
        let requiredIndex = requiredRefundArray.findIndex((e)=>{
            return id==e.id;
        });
        
        if(requiredIndex==-1){
            requiredRefundArray = [...requiredRefundArray,{...requiredArray[index]}];
        }else{
            requiredRefundArray[requiredIndex].noofpieces += requiredArray[index].noofpieces;
        }
        


        requiredArray[index].noofpieces = 0;
        
        this.setState({
                dialogRefundQuantity:false,
                refundQuantity:'',
                refundObject:[...requiredRefundArray],
                salesArray:[...requiredArray],
            }
        );
        
    }

    dialogRefundQuantityAction = (e)=>{
        e.preventDefault();

        let requiredArray = JSON.parse(JSON.stringify(this.state.salesArray));
        let refundObject = [...this.state.refundObject, {...requiredArray[this.state.index],noofpieces:Number(this.state.refundQuantity)}];
        requiredArray[this.state.index].noofpieces -= Number(this.state.refundQuantity);
        
        this.setState({
                dialogRefundQuantity:false,
                refundQuantity:'',
                refundObject:[...refundObject],
                salesArray:[...requiredArray],
            }
        );
        
    }

    refundConfirmHandler = client =>async ()=>{

        try{
            let refundAmount = 0;
            for(let i in this.state.refundObject){
                let res = await client.mutate({
                    mutation:REFUNDITEMS_MUTATION,
                    variables:{
                        id:this.state.refundObject[i].id,
                        quantity:this.state.refundObject[i].noofpieces
                    }
                });
                refundAmount += res.data.refundItems;
            }
            
            this.setState({
                refundAmountDialog:true,
                refundAmount:Math.round(refundAmount)
            });

        }catch(err){
            console.log(err);
        }

    }

    render(){
        const {
            ticket,
            ticketLoading,
            index,
            errorInfo,
            errorDialog,
            salesArray,
            refundAmountDialog,
            refundQuantity,
            dialogRefundQuantity,
            refundAmount
        } = this.state;
        return(
            <>
            <ApolloConsumer>
                {
                    (client)=>{
                        if(ticketLoading){
                            return(
                                <div className="mainLoadingStyle">
                                    <CircularProgress size={70} />
                                </div>
                            )
                        }
                        return(
                            <>
                                <form onSubmit={this.ticketSubmitHandler(client)}>
                                    <div className="mainFormStyle">
                                        <TextField 
                                            label="Ticket Number"
                                            variant="outlined"
                                            type="text"
                                            name="ticket"
                                            value={ticket}
                                            onChange={this.inputChangeHandler}
                                            required
                                        />
                                        <Button 
                                            variant="contained"
                                            size="large"
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                               
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Sr#</th>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                salesArray.map((el,index)=>{
                                                    const {id,noofpieces,priceSold,product:{name}} = el;
                                                    
                                                    return(
                                                        <Refund_By_Ticket_Table 
                                                            key={index}
                                                            id={id}
                                                            index={index}
                                                            name={name}
                                                            quantity={noofpieces}
                                                            price={priceSold}
                                                            refundByQuantity={this.refundByQuantity}
                                                            refundAll={this.refundAll}
                                                        />
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        this.state.refundObject.length>0 && 
                                                    <DialogActions>
                                                        <Button 
                                                            variant="contained"
                                                            onClick={this.refundConfirmHandler(client)}
                                                        >Confirm Refund</Button>
                                                    </DialogActions>
                                    }        
                                    
                            </>
                        )
                    }
                }
            </ApolloConsumer>
            
            <Dialog open={dialogRefundQuantity} onClose={()=>this.setState({dialogRefundQuantity:false,refundQuantity:''})}>
                
                <div className="dialogTitleStyle">
                    <h2>Enter Quantity to refund</h2>
                    <IconButton onClick={()=>this.setState({dialogRefundQuantity:false,refundQuantity:''})}>
                        <Cancel className={styles.delete} />
                    </IconButton>
                </div>
                <DialogContent>
                    <form className={styles.formMargin} onSubmit={this.dialogRefundQuantityAction}>
                        <TextField 
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            name="refundQuantity"
                            autoFocus
                            fullWidth
                            value={refundQuantity}
                            onChange={this.inputChangeHandler}
                            {
                                ...(salesArray[index] && (refundQuantity > salesArray[index].noofpieces || refundQuantity < 0) && {error:true, helperText:"The amount is not valid"})
                            }
                        />
                        <Button 
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={salesArray[index] && (refundQuantity > salesArray[index].noofpieces || refundQuantity < 0) && true}
                            fullWidth
                        >
                            Submit
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <ErrorDialog dialogValue={errorDialog} dialogClose={()=>this.setState({errorDialog:false})}>
                {errorInfo}
            </ErrorDialog>

            <Dialog open={refundAmountDialog} onClose={()=>Router.push('/')}>
                <DialogTitle>Refund Amount is</DialogTitle>
                <DialogContent>
                    <h2 style={{textAlign:"center"}}>{refundAmount}</h2>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={()=>Router.push('/')}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
       </>
        )
    }
}

export default Refund_By_Ticket;