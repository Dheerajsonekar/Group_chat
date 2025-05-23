const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticate = require('../middleware/authentication');  

router.post('/groups', authenticate, groupController.createGroup);
// router.get('/groups', authenticate, groupController.getUserGroups);
router.post('/groups/:groupId/invite', authenticate, groupController.inviteToGroup);
router.post('/groups/:groupId/message', authenticate, groupController.sendMessageToGroup);
router.get('/groups/:groupId/messages', authenticate, groupController.getGroupMessages);
router.get('/group/joined', authenticate, groupController.getJoinedGroups);


module.exports = router;
