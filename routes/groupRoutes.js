const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticate = require('../middleware/authentication');  

router.post('/groups', authenticate, groupController.createGroup);

router.post('/groups/:groupId/invite', authenticate, groupController.inviteToGroup);
router.post('/groups/:groupId/message', authenticate, groupController.sendMessageToGroup);
router.get('/groups/:groupId/messages', authenticate, groupController.getGroupMessages);
router.get('/group/joined', authenticate, groupController.getJoinedGroups);
router.get("/groups/:groupId/members", authenticate, groupController.getGroupMembers);
router.post("/groups/:groupId/make-admin", authenticate, groupController.makeAdmin);
router.delete("/groups/:groupId/remove-user/:userId", authenticate, groupController.removeUserFromGroup);


module.exports = router;
