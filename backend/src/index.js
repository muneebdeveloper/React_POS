const createServer = require('./createServer');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'.env'});

const server = createServer();

server.express.use(cookieParser());

server.express.use(
    (req,res,next)=>{
        const {token} = req.cookies;

        if(token){
            const {userId} = jwt.verify(token,process.env.JWT_SECRET);
            req.userId = userId;
        }

        next();
    }
);


server.start({
    cors:{
        credentials:true,
        origin:process.env.FRONTEND_URL
    }
}, deets=>{
    console.log(`Server is running on : http://localhost:${deets.port}`)
});