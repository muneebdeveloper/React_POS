import React, {Component} from 'react';
import {Query, Mutation,ApolloConsumer} from 'react-apollo';
import gql from 'graphql-tag';
import {FETCH_LINEITEMS_QUERY} from './Category';

import ErrorDialog from '../../misc/ErrorDialog';
import SnackBar from '../../misc/SnackBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './Product.css';

const CATEGORY_ITEMS_QUERY = gql`
    query CATEGORY_ITEMS_QUERY($id:ID!){
        categories(where:{lineitem:{id:$id}}){
                id
                name
            }
    }
`;


 const PRODUCT_CREATE_MUTATION = gql`
    mutation PRODUCT_CREATE_MUTATION($barcode:String!,$name:String!,$id:ID!){
        createProduct(data:{barcode:$barcode,name:$name,category:{connect:{id:$id}}}){
            id
            barcode
        }
    }
 `;

 const PRODUCT_BARCODE_QUERY = gql`
    query PRODUCT_BARCODE_QUERY($barcode:String!){
        product(where:{barcode:$barcode}){
            name
        }
    }
 `;

 const CREATE_BARCODE_MUTATION = gql`
    mutation CREATE_BARCODE_MUTATION($productID:String!){
        createBarcode(data:{productID:$productID}){
            id
        }
    }
 `;


class Product extends Component{

    state={
        name:'',
        barcode:'',
        generated_barcode:'',
        lineitemID:'',
        loadingID:false,
        errorDialogOpen:false,
        errorMessage:'',
        snackbarOpen:false,
        categoryList:[],
        categoryID:'',
        loadingGenBarcode:false
    }

    lineitemSelectChangeHandler = client =>async e=>{
        
        const lineitemID = e.target.value;
        this.setState({
            lineitemID,
            loadingID:true
        })

        try{
            
            const res = await client.query({
                query:CATEGORY_ITEMS_QUERY,
                variables:{
                    id:lineitemID
                }
            });
            const {data:{categories}} = res;
            this.setState({
                categoryList : [...categories],
                loadingID:false
            });
        }catch(err){
            this.setState({
                errorDialogOpen:true,
                errorMessage:"Something went wrong"
            });
        }
    }

   changeHandler = e =>{
       
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    formSubmitHandler=(createProduct,client)=>async e=>{
        e.preventDefault();
        try{
            let res = await createProduct();

            if(res.data.createProduct.barcode==this.state.generated_barcode){
                await client.mutate({
                    mutation:CREATE_BARCODE_MUTATION,
                    variables:{
                        productID:res.data.createProduct.id
                    }
                });
            }
                       
            this.setState({
                name:'',
                barcode:'',
                lineitemID:'',
                loadingID:false,
                categoryList:[],
                categoryID:'',
            });
        }catch(err){

        }
       
    }

    barcodeGeneratorHandler =(client)=>async()=>{
        let generated_barcode = Math.floor((Math.random() * 9000000000000) + 1000000000000);
        let run = true;
        this.setState({
            loadingGenBarcode:true
        })
        while(run){

            const res = await client.query({
                query:PRODUCT_BARCODE_QUERY,
                variables:{
                    barcode:String(generated_barcode),
                }
            }
            );
            
            if(!res.data.product){
                run=false;
            }else{
            generated_barcode = Math.floor((Math.random() * 9000000000000) + 1000000000000);
            }
            
        }
        this.setState({
            barcode:generated_barcode,
            generated_barcode,
            loadingGenBarcode:false
        })
       
    }

    render(){
        const { barcode,
                name,
                errorDialogOpen,
                errorMessage,
                lineitemID,
                loadingID,
                categoryList,
                categoryID,
                snackbarOpen,
                loadingGenBarcode
               } = this.state;
        const { isMain } = this.props;

        return(
           
            <Query 
                query={FETCH_LINEITEMS_QUERY}
                onError={
                    ()=>{
                        this.setState({
                            errorDialogOpen:true,
                            errorMessage:"something Went wrong"
                        })
                    }
                }
            >
                {({data,loading})=>{

                    if(loading){
                        return (
                            <div className="mainLoadingStyle">
                                <CircularProgress size={70} />
                            </div>
                        );
                    }

                    if(errorDialogOpen){
                        return(
                            <ErrorDialog dialogValue={errorDialogOpen} dialogClose={()=>this.setState({errorDialogOpen:false})}>
                                {errorMessage}
                            </ErrorDialog>
                        )
                    }

                    return(
                    
                    <ApolloConsumer>
                        {(client)=>{
                            return(
                            <Mutation 
                                mutation={PRODUCT_CREATE_MUTATION} 
                                variables={{name,barcode:String(barcode),id:categoryID}}
                                onCompleted={()=>this.setState({snackbarOpen:true})}
                                onError={()=>{this.setState({
                                        errorDialogOpen:true,
                                        errorMessage:"The barcode already exists"
                                    })}}
                            >
                                {
                                    (createProduct,{loading})=>{

                                        if(loading){
                                            return (
                                                <div className="mainLoadingStyle">
                                                    <CircularProgress size={70} />
                                                </div>
                                            );
                                        }
                    
                                        if(errorDialogOpen){
                                            return(
                                                <ErrorDialog dialogValue={errorDialogOpen} dialogClose={()=>this.setState({errorDialogOpen:false})}>
                                                    {errorMessage}
                                                </ErrorDialog>
                                            )
                                        }

                                        return(
                                            <>
                                            
                                            <form onSubmit={this.formSubmitHandler(createProduct,client)}>
                                                <div className={isMain ? "mainFormStyle":styles.componentDialogMargin}>

                                                    <ApolloConsumer>
                                                        {
                                                            (client)=>{
                                                                return(
                                                                    <span 
                                                                        className={`${styles.spanBarcode} ${isMain?styles.spanBarcodeMain:styles.spanBarcodeDialog}`}
                                                                        onClick={this.barcodeGeneratorHandler(client)}
                                                                    >
                                                                        {
                                                                            loadingGenBarcode ? (
                                                                                <CircularProgress />
                                                                            ):<>Generate Barcode</>
                                                                        }
                                                                       
                                                                    </span>
                                                                )
                                                            }
                                                        }
                                                    </ApolloConsumer>
                                                    

                                                    <TextField 
                                                        label="Barcode"
                                                        name="barcode"
                                                        variant="outlined"
                                                        type="text"
                                                        value={barcode}
                                                        onChange={this.changeHandler}
                                                        autoFocus
                                                        required
                                                        fullWidth={!isMain}
                                                    />

                                                    <TextField 
                                                        label="Name"
                                                        name="name"
                                                        variant="outlined"
                                                        type="text"
                                                        value={name}
                                                        onChange={this.changeHandler}
                                                        required
                                                        fullWidth={!isMain}
                                                    />

                                                    <FormControl 
                                                        required 
                                                        fullWidth={!isMain}
                                                    >
                                                        <InputLabel>Select LineItem</InputLabel>
                                                        <Select
                                                            name="lineitemID"
                                                            value={lineitemID}
                                                            onChange={this.lineitemSelectChangeHandler(client)}
                                                        >
                                                            {
                                                                Object.keys(data).length > 0 && 
                                                                data.lineItems.map((lineitem)=>{
                                                                    return(
                                                                        <MenuItem value={lineitem.id} key={lineitem.id}>{lineitem.name}</MenuItem>
                                                                    );
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>

                                                    {
                                                        loadingID ?
                                                        (
                                                            <CircularProgress size={45} />
                                                        ):
                                                        (
                                                            <FormControl 
                                                                required 
                                                                fullWidth={!isMain}
                                                            > 
                                                                <InputLabel>Select Category</InputLabel>
                                                                <Select
                                                                    name="categoryID"
                                                                    value={categoryID}
                                                                    onChange={this.changeHandler}
                                                                >
                                                                    {
                                                                        categoryList.map((category)=>{
                                                                            return(
                                                                            <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                                                                            )
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                        )
                                                    }
                                                    <Button
                                                        size="large"
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth={!isMain}
                                                    >
                                                        Create
                                                    </Button>

                                                </div>
                                            </form>
                                            <SnackBar snackbarValue={snackbarOpen} snackbarClose={()=>this.setState({snackbarOpen:false})}>
                                                The product is successfully created
                                            </SnackBar>
                                            </>

                                                );       
                                    }
                                }
                        </Mutation>);
                        }
                        }
                    </ApolloConsumer>
                    
                 
                    )
                }
                }
            </Query>
            
        );
    }
}

export default Product;