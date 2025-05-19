const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/authentication');

router.post('/message', auth, messageController.storeMessage);
router.get('/allchat', auth, messageController.getAllChat);



module.exports = router;