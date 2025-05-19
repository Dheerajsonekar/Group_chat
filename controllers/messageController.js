const Message = require('../models/Message');

exports.storeMessage = async (req, res)=>{
    const id = req.user.userId;
    try{
      const {message} = req.body();
      const response = await Message.create({message});
      res.status(200).json(response);
    }catch(err){
     res.status(500).json(err);
    }
}