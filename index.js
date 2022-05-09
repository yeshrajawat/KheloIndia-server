require('dotenv').config();
const express = require('express');
const PORT = 3001;
const db = require('./config/mongoose');
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.use('/',routes);



app.listen(PORT, (err)=>{
    if(err){
        console.log('Failed while listening to the port: ',PORT);
    }
    else{
        console.log('Successfully Listening to the port: ',PORT);
    }
});