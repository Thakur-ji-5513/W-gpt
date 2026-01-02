import express from 'express';
import { createNewChat,sendMessage,getUserChats,getChatById,deleteChat } from '../Controllers/chatController.js';

const router = express.Router();


router.post('/chats', createNewChat);

router.get('/chats/user/:userId', getUserChats);

router.get('/chats/:chatId', getChatById);

router.post('/chats/:chatId/message', sendMessage);

router.delete('/chats/:chatId', deleteChat);

export default router;