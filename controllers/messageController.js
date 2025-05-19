const Message = require('../models/Message');

exports.storeMessage = async (req, res)=>{
  console.log("inside storeMessage")
    const id = req.user.userId;
    console.log("id: ", id);
    try{
      const {message} = req.body;
      const response = await Message.create({message, userId: id});
      res.status(200).json(response);
    }catch(err){
     res.status(500).json(err);
    }
}


exports.getAllChat = async (req, res)=>{
  console.log("inside getAllChat");

  try{
    const response = await Message.findAll();
    res.status(200).json(response);
  }catch(err){
    res.status(500).json(err);
  }
}