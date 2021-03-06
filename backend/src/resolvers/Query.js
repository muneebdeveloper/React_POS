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
                    let requiredObject = product.stock.pop();
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

        
        let {expiryDays:days} = await ctx.db.query.settings({where:{name:"main"}});

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
        let expiriesConnection = await ctx.db.query.expiriesConnection(undefined,`{aggregate{count}}`)
        return expiriesConnection.aggregate.count;
        
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
    async checkQuantity(parent,args,ctx,info){
        let {quantityDays:quantity} = await ctx.db.query.settings({where:{name:"main"}});
        let products = await ctx.db.query.products(undefined,`{id name stock{noofpieces}}`);

        
        for(let i in products){
            let quantityCount = 0;
            for(let j in products[i].stock){
                
                quantityCount += products[i].stock[j].noofpieces;
            }
            
            if(quantityCount <= quantity && products[i].stock.length>0 ){
                let res = await ctx.db.query.quantity({where:{productID:products[i].id}});
                if(!res){
                    ctx.db.mutation.createQuantity({data:{productID:products[i].id}});
                }
            }
        }
        let quantitiesConnection = await ctx.db.query.quantitiesConnection(undefined,`{aggregate{count}}`)
        return quantitiesConnection.aggregate.count;
    },
    async AllQuantitiesData(parent,args,ctx,info){
        let quantitiesInfoArray=[];

        let quantities = await ctx.db.query.quantities();
        let {quantityDays }= await ctx.db.query.settings({where:{name:"main"}},`{quantityDays}`);

        for(let i in quantities){
            
            let product = await ctx.db.query.product({where:{id:quantities[i].productID}},`{name stock{noofpieces}}`);
            
            if(product){
                let noofpieces = 0;
                for(let i in product.stock){
                    noofpieces += product.stock[i].noofpieces
                } 
                if(noofpieces>quantityDays){
                    ctx.db.mutation.deleteQuantity({where:{id:quantities[i].id}},`{id}`);
                }else{
                let {name} = product;
                quantitiesInfoArray = [...quantitiesInfoArray,{quantityID:quantities[i].id,name,description:`Number of pieces left are ${noofpieces}`}];
                }
            }else{
                ctx.db.mutation.deleteQuantity({where:{id:quantities[i].id}},`{id}`);
            }
            
        }

        return [...quantitiesInfoArray];
    },
    async productsAudit(parent,args,ctx,info){

        // Creating an array for final results
        let productsAudit = [],products;

        // Fetching products according to given information
        if(args.data.lineitemID){
            products = await ctx.db.query.products({
                where:{
                    category:{
                        lineitem:{
                            id:args.data.lineitemID
                        }
                    }
                }
            },`{name barcode stock(orderBy:createdAt_ASC){noofpieces sellPrice wholesalePrice}}`);
        }else if(args.data.categoryID){
            products = await ctx.db.query.products({
                where:{
                    category:{
                            id:args.data.categoryID
                    }
                }
            },`{name barcode stock(orderBy:createdAt_ASC){noofpieces sellPrice wholesalePrice}}`);
        }else{
            products = await ctx.db.query.products(undefined,
                `{name barcode stock(orderBy:createdAt_ASC){noofpieces sellPrice wholesalePrice}}`
                );
        }
        

        // Calculating no of pieces, sellPrice, wholesalePrice
        let quantity, sellPrice, wholesalePrice;
        for(let i in products){
            quantity = 0;sellPrice=0,wholesalePrice=0;
            for(let j in products[i].stock){
                quantity += products[i].stock[j].noofpieces;
                sellPrice = products[i].stock[products[i].stock.length-1].sellPrice;
                wholesalePrice = products[i].stock[products[i].stock.length-1].wholesalePrice
            }
            productsAudit.push({
                name:products[i].name,
                barcode:products[i].barcode,
                quantity,
                sellPrice,
                wholesalePrice
            });
        }
        return [...productsAudit];
    },
    async productsFilterSearch(parent,{data:{name,barcode,sellPrice,wholesalePrice}},ctx,info){

        let productFilterResult = [];

        let products = await ctx.db.query.products({
            where:{
                AND:[
                    {name_contains:name},
                    {barcode_contains:barcode},
                    {stock_some:{
                        AND:[
                            {...(sellPrice ? {sellPrice_gte:sellPrice}:{sellPrice_gte:0})},
                            {...(wholesalePrice ? {wholesalePrice_gte:wholesalePrice}:{wholesalePrice_gte:0})}
                        ]
                    }}
                ]
            }
        },
        `{name barcode stock(orderBy:createdAt_ASC){sellPrice wholesalePrice}}`);

        let strSellPrice = String(sellPrice),strWholesalePrice = String(wholesalePrice);

        if(sellPrice==0){
            strSellPrice = "";
        }

        if(wholesalePrice==0){
            strWholesalePrice = "";
        }


        if(sellPrice || wholesalePrice){

            for(let i in products){
                let resultSellPrice = String(products[i].stock[products[i].stock.length-1].sellPrice);
                let resultwholesalePrice = String(products[i].stock[products[i].stock.length-1].wholesalePrice);
                if(resultSellPrice.startsWith(strSellPrice) && resultwholesalePrice.startsWith(strWholesalePrice)){
                    productFilterResult.push({
                        name:products[i].name,
                        barcode:products[i].barcode,
                        sellPrice:products[i].stock[products[i].stock.length-1].sellPrice,
                        wholesalePrice:products[i].stock[products[i].stock.length-1].wholesalePrice
                    });
                }
            }

        }else{
            productFilterResult = products.map((product)=>{
                return{
                    name:product.name,
                    barcode:product.barcode,
                    sellPrice:product.stock[product.stock.length-1].sellPrice,
                    wholesalePrice:product.stock[product.stock.length-1].wholesalePrice
                }
            });
        }

        return [...productFilterResult];

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
    expiriesConnection:forwardTo('db'),
    quantitiesConnection:forwardTo('db')
}

module.exports = Query;