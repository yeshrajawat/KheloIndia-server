const mongoose = require('mongoose');

const TenderSchema = new mongoose.Schema({
    tenderId:{
        type:Number,
        required:true,
        unique:true
    },
    
    tendername:{
        type:String,
        required:true,

    },
    tenderDesc:{
        type:String,
    }
    
    ,
    currentBid:{
        type:Number,
        required:true
    },
    lastDate:{
        type:Number,
        required:true
    }
    ,
    usersApplied:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',

            },
            bidPrice:{
                type:Number,

            }
        },
        
    ]
},{timestamps:true});

const Tender = mongoose.model('Tender',TenderSchema);
module.exports = Tender;