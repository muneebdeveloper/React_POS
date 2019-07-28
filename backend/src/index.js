const createServer = require('./createServer');
const cookieParser = require('cookie-parser');
require('dotenv').config({path:'.env'});

const server = createServer();

server.express.use(cookieParser());


server.start({
    cors:{
        credentials:true,
        origin:process.env.FRONTEND_URL
    }
}, deets=>{
    console.log(`Server is running on : http://localhost:${deets.port}`)
});