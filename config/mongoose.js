const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jiinxx007:Yeshrajawat123@cluster0.zk9pb.mongodb.net/KHELOINDIA?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error',console.error.bind('console','Error while connecting to the MongoDB'));

db.once('open', ()=> {
    console.log('Connected to the Database :: MongoDB');
});

module.exports = db;