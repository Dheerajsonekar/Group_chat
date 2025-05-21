const { Op } = require('sequelize');
const Message = require('../models/Message');
const User = require('../models/User');

exports.storeMessage = async (req, res) => {
  const userId = req.user.userId;

  try {
    const { message } = req.body;
    const newMessage = await Message.create({ message, userId });

    const user = await User.findByPk(userId, { attributes: ['name'] });

    res.status(200).json({
      id: newMessage.id,
      message: newMessage.message,
      username: user.name,
      createdAt: newMessage.createdAt
    });
  } catch (err) {
    console.error("Error storing message:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getAllChat = async (req, res) => {
  const afterId = req.query.after ? parseInt(req.query.after) : 0;

  try {
    const messages = await Message.findAll({
      where: {
        id: { [Op.gt]: afterId }
      },
      include: [{ model: User, attributes: ['name'] }],
      order: [['id', 'ASC']]
    });

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      message: msg.message,
      username: msg.user.name,
      createdAt: msg.createdAt
    }));

    res.status(200).json(formattedMessages);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
