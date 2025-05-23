const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const Message = require('../models/Message');
const User = require("../models/User");

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const group = await Group.create({ name, createdBy: userId });

    await GroupMember.create({
      userId: userId,
      groupId: group.id,
      isAdmin: true,
    });

    res.status(201).json({ message: "Group created successfully", group });
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserGroups = async (req, res) => {
  const userId = req.user.userId;

  try {
    const groups = await Group.findAll({
      include: {
        model: GroupMember,
        where: { userId },
        attributes: [],
      },
    });

    res.status(200).json(groups);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};


exports.inviteToGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const invitedUserId = req.body.userId;
  const loggedInUserId = req.user.userId;

  try {
    const isAdmin = await GroupMember.findOne({
      where: {
        userId: loggedInUserId,
        groupId,
        isAdmin: true,
      },
    });

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Only group admins can invite users" });
    }

    await GroupMember.create({
      userId: invitedUserId,
      groupId,
      isAdmin: false,
    });

    res.status(200).json({ message: "User invited to group" });
  } catch (err) {
    console.error("Error inviting user:", err);
    res.status(500).json({ error: "Failed to invite user" });
  }
};


exports.sendMessageToGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const { message } = req.body;
  const userId = req.user.userId;

  try {
    const newMessage = await Message.create({
      message,
      groupId,
      userId
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};


exports.getGroupMessages = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user.userId;

  try {
    // Check if user is part of group
    const member = await GroupMember.findOne({
      where: { userId, groupId }
    });

    if (!member) {
      return res.status(403).json({ error: 'Not authorized to view this group chat' });
    }

    const messages = await Message.findAll({
      where: { groupId },
      include: { model: User, attributes: ['name'] },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching group messages:", err);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};


exports.getJoinedGroups = async (req, res) => {
  const userId = req.user.userId;

  try {
    const groups = await Group.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { id: userId },
          attributes: []  
        }
      ],
      attributes: ['id', 'name']
    });

    res.status(200).json(groups);
  } catch (err) {
    console.error('Error fetching joined groups:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
;