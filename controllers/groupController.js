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


// Get all members of a group
exports.getGroupMembers = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user.userId;

  try {
    const isMember = await GroupMember.findOne({
      where: { userId, groupId },
    });

    if (!isMember) {
      return res.status(403).json({ error: "Not a group member" });
    }

    const members = await GroupMember.findAll({
      where: { groupId },
      include: {
        model: User,
        as:'user',
        attributes: ["id", "name"],
      },
    });

    const formatted = members.map((m) => ({
      id: m.userId,
      username: m.user.name,
      isAdmin: m.isAdmin,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Make a member an admin
exports.makeAdmin = async (req, res) => {
  const groupId = req.params.groupId;
  const targetUserId = req.body.userId;
  const requestingUserId = req.user.userId;

  try {
    const isAdmin = await GroupMember.findOne({
      where: { userId: requestingUserId, groupId, isAdmin: true },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: "Only admins can promote" });
    }

    const target = await GroupMember.findOne({
      where: { userId: targetUserId, groupId },
    });

    if (!target) {
      return res.status(404).json({ error: "User not found in group" });
    }

    target.isAdmin = true;
    await target.save();

    res.status(200).json({ message: "User is now admin" });
  } catch (err) {
    console.error("Error promoting to admin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove a user from the group
exports.removeUserFromGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const targetUserId = req.params.userId;
  const requestingUserId = req.user.userId;

  try {
    const isAdmin = await GroupMember.findOne({
      where: { userId: requestingUserId, groupId, isAdmin: true },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: "Only admins can remove users" });
    }

    const target = await GroupMember.findOne({
      where: { userId: targetUserId, groupId },
    });

    if (!target) {
      return res.status(404).json({ error: "User not found in group" });
    }

    await target.destroy();

    res.status(200).json({ message: "User removed from group" });
  } catch (err) {
    console.error("Error removing user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
