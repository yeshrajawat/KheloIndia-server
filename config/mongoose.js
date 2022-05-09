const mongoose = require('mongoose');

const URL = `mongodb+srv://jiinxx007:${process.env.DB_HOSTNAME_PASSWORD}@cluster0.zk9pb.mongodb.net/KHELOINDIA?retryWrites=true&w=majority`;

mongoose.connect(URL,{
    useNewUrlParser:true
});

const db = mongoose.connection;
db.on('error',console.error.bind('console','Error while connecting to the MongoDB'));

db.once('open', ()=> {
    console.log('Connected to the Database :: MongoDB');
});

module.exports = db;