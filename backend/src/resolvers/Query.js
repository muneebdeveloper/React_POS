const {forwardTo} = require('prisma-binding');

const getNumberOfDays = (expiryDate, currentDate)=>{
    return Math.ceil((expiryDate-currentDate)/(1000*3600*24));
}

const Query = {
    currentUser(parent,args,ctx,info){

        if(!ctx.request.userId){
            return null;
        }
        return ctx.db.query.user({
            where:{
                id:ctx.request.userId
            }
        },info);
    },
    async priceDetails(parent,{where:{barcode,type}},ctx,info){

        // Querying the product stocks from the barcode given in args
        let product = await ctx.db.query.product({where:{barcode}},`{id name stock(orderBy:createdAt_ASC){noofpieces sellPrice wholesalePrice}}`);

        if(product){
            // Counting the number of pieces
            let quantity = 0; 
            for(let i in product.stock){
                quantity += product.stock[i].noofpieces;
            };

            // Getting the required price according to type
            let price;
            if(product.stock.length>0){
                price=type==='retailsale'?product.stock.pop().sellPrice:product.stock.pop().wholesalePrice;
            }
            
            // Returning the required object
            return{
                productID:product.id,
                name:product.name,
                price,
                quantity            
            };
        }else{
            return null;
        }

    },
    async AllBarcodesData(parent,args,ctx,info){
        let barcodesInfoArray=[];

        let barcodes = await ctx.db.query.barcodes();

        for(let i in barcodes){
            
            let product = await ctx.db.query.product({where:{id:barcodes[i].productID}},`{name barcode stock(orderBy:createdAt_ASC){sellPrice wholesalePrice} }`);
            
            if(product){
                let sellPrice,wholesalePrice;
                if(product.stock.length>0){
                    let {requiredObject} = stock.pop();
                    sellPrice=requiredObject.sellPrice;
                    wholesalePrice=requiredObject.wholesalePrice;
                }
                let {name,barcode} = product;
                barcodesInfoArray = [...barcodesInfoArray,{barcodeID:barcodes[i].id,name,barcode,sellPrice,wholesalePrice}];
            }else{
                ctx.db.mutation.deleteBarcode({where:{id:barcodes[i].id}},`{id}`);
            }
            
        }

        return [...barcodesInfoArray];
    },
    async checkExpiry(parent,args,ctx,info){

        
        let days = args.days;
// 
        let products = await ctx.db.query.products(undefined,`{id name stock{expiry}}`);

        let currentDate = new Date();

        for(let i in products){
            for(let j in products[i].stock){
                if(products[i].stock[j].expiry){
                    let res = await ctx.db.query.expiry({where:{productID:products[i].id}},`{id}`);
                    if(res){
                        break;
                    }
                    let expiryDate = new Date(products[i].stock[j].expiry);
                    if(getNumberOfDays(expiryDate,currentDate)<=0 ){
                        ctx.db.mutation.createExpiry({data:{productID:products[i].id,description:"Product is expired"}},`{id}`);
                        break;
                    }else if(getNumberOfDays(expiryDate,currentDate)<=days ){
                        ctx.db.mutation.createExpiry({data:{productID:products[i].id,description:"Product is going to expire"}},`{id}`);
                        break;
                    }
                
                }
                
            }
        }
        return {message:"All expiries checked successfully"};
        
    },
    async AllExpiriesData(parent,args,ctx,info){
        let expiriesInfoArray=[];

        let expiries = await ctx.db.query.expiries();

        for(let i in expiries){
            
            let product = await ctx.db.query.product({where:{id:expiries[i].productID}},`{name barcode}`);
            
            if(product){
                let {name,barcode} = product;
                expiriesInfoArray = [...expiriesInfoArray,{expiryID:expiries[i].id,name,barcode,description:expiries[i].description}];
            }else{
                ctx.db.mutation.deleteExpiry({where:{id:expiries[i].id}},`{id}`);
            }
            
        }

        return [...expiriesInfoArray];
    },
    product:forwardTo('db'),
    products:forwardTo('db'),
    barcodes:forwardTo('db'),
    stockItem:forwardTo('db'),
    salesTicket:forwardTo('db'),
    supplier:forwardTo('db'),
    lineItems:forwardTo('db'),
    categories:forwardTo('db'),
    products:forwardTo('db'),
    suppliers:forwardTo('db'),
    paidDetails:forwardTo('db'),
    salesItems:forwardTo('db'),
    expense:forwardTo('db'),
    expenses:forwardTo('db'),
    barcodesConnection:forwardTo('db'),
    expiriesConnection:forwardTo('db')
}

module.exports = Query;