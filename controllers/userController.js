const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

exports.register = async (req, res)=>{

    const t = await sequelize.transaction();
    console.log(req.body);
    try{
        const {name, email, phone, password} = req.body;
        const alreadyEmail = await User.findOne({where: { email}});
        if(alreadyEmail){
            return res.status(409).json({message: "email already exits"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await User.create({name, email, phone, password: hashedPassword}, {transaction: t});

        await t.commit();
       

        res.status(200).json(response);

    }catch(err){
        await t.rollback();
        res.status(500).json(err);
    }
}