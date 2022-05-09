const Tender = require('../model/Tender');
const User = require('../model/User');

module.exports.createTender = (req,res) => {
    const tender = req.body;
    console.log(tender);
    Tender.findOne({tenderId:tender.tenderId},(err,tenderFound)=> {
        if(err){
            console.log(err);
        }
        else if(tenderFound){
            return res.status(200).json({message:"Tender Already Exists"});
        }
        else if(!tenderFound){
            console.log('tender not found will create new one');

            const newTender = new Tender({
                tenderId:tender.tenderId,
                tendername:tender.tendername,
                tenderDesc:tender.tenderDesc,
                currentBid:tender.currentBid,
                lastDate:tender.lastDate
            });
            try {
                newTender.save();
                return res.status(200).json({message:"Tender Created Successfully",});
           } catch (error) {
               console.log(error);
           }
       
           return res.status(201).json({tender:newTender});

            
        }
    })
}

module.exports.all = (req,res) => {
    Tender.find({},"-usersApplied -__v",(err,tender)=> {
        if(err){
            console.log('err');
            return res.status(400).json({message:err});
        }
        else{
            console.log(tender);
            return res.status(200).json({tenderList:tender});
        }
    })
}

module.exports.apply = (req,res) => {
    const tenderInfo = req.body;
    console.log(tenderInfo.usersApplied);


    Tender.findByIdAndUpdate({_id:tenderInfo._id},{
        $push:{
            usersApplied:tenderInfo.usersApplied[0]
        }
        
    },(err,newtender)=> {
        if(err){
            console.log(err);
            return;
        }
        if(newtender){
    
            if(newtender.currentBid < tenderInfo.usersApplied[0].bidPrice){
                console.log(newtender.currentBid);
            console.log(tenderInfo.usersApplied[0].bidPrice);
            const newPrice = tenderInfo.usersApplied[0].bidPrice;
                Tender.findByIdAndUpdate({_id:tenderInfo._id},{currentBid:newPrice},
                    (err,updatedTender)=>{

                        const cookies = req.headers.cookie;
                        console.log(cookies);
                        const userId = cookies.split("=")[0];
                        User.findByIdAndUpdate({_id:userId},
                            {
                                $push:{
                                    tendersApplied:{
                                        tenderId:tenderInfo._id,
                                         $push:{
                                            bidPrice:tenderInfo.usersApplied[0].bidPrice
                                        }

                                    }
                                }
                            })
                        return res.status(200).json({tender:updatedTender})
                    })
            }
            return res.status(200).json({tender:newtender});
        }

    })
}

