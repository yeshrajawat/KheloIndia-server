const express = require('express');
const PORT = 3001;
const db = require('./config/mongoose');
const routes = require('./routes/index');
const app = express();
app.use(express.json());

app.use('/',routes);



app.listen(PORT, (err)=>{
    if(err){
        console.log('Failed while listening to the port: ',PORT);
    }
    else{
        console.log('Successfully Listening to the port: ',PORT);
    }
});