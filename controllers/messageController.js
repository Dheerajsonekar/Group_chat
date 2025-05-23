const { Op } = require('sequelize');
const Message = require('../models/Message');
const User = require('../models/User');
const GroupMember = require('../models/GroupMember');
const Group = require('../models/Group');

// Send a message to a group
exports.storeMessage = async (req, res) => {
  const userId = req.user.userId;
  const groupId = parseInt(req.query.groupId);

  if (!groupId) return res.status(400).json({ error: "groupId is required" });

  try {
    // Check if user is in the group
    const isMember = await GroupMember.findOne({ where: { userId, groupId } });
    if (!isMember) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    const { message } = req.body;
    const newMessage = await Message.create({ message, userId, groupId });

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

// Fetch new messages for a group
exports.getAllChat = async (req, res) => {
  const userId = req.user.userId;
  const groupId = parseInt(req.query.groupId);
  const afterId = req.query.after ? parseInt(req.query.after) : 0;

  if (!groupId) return res.status(400).json({ error: "groupId is required" });

  try {
    // Ensure user is a member
    const isMember = await GroupMember.findOne({ where: { userId, groupId } });
    if (!isMember) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    const messages = await Message.findAll({
      where: {
        groupId,
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
