import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { generateChatResponse, generateChatTitle } from '../Utils/geminiService.js';


export async function createNewChat(req, res) {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const aiResponse = await generateChatResponse([
      { role: 'user', content: message }
    ]);

    const title = await generateChatTitle(message);

    const newChat = new Chat({
      userId: userId,
      title: title,
      messages: [
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]
    });

    await newChat.save();
    res.status(201).json(newChat);

  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
}

// Function 2: getUserChats
export async function getUserChats(req, res) {
  try {
    const { userId } = req.params;  
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const allChats = await Chat.find({  
      userId: userId,
      isDeleted: false
    })
    .sort({ updatedAt: -1 })
    .select('_id title updatedAt');

    res.status(200).json(allChats);
    
  } catch (err) {
    console.error('Error getting chats:', err);
    res.status(500).json({ error: 'Failed to retrieve chats' });
  }
}

// Function 3: getChatById
export async function getChatById(req, res) {
  try {
    const { chatId } = req.params;  

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.isDeleted === true) {
      return res.status(404).json({ error: 'Chat has been deleted' });
    }

    res.status(200).json(chat);

  } catch (err) {
    console.error('Error getting chat:', err);
    res.status(500).json({ error: 'Failed to retrieve chat' });
  }
}

// Function 4: sendMessage
export async function sendMessage(req, res) {
  try {
    const { chatId } = req.params;  
    const { message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'chatId and message are required' });
    }

    const chat = await Chat.findById(chatId);  

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.isDeleted === true) {
      return res.status(400).json({ error: 'Cannot send message to deleted chat' });
    }

    
    const recentMessages = chat.messages.slice(-15);
    recentMessages.push({ role: 'user', content: message });

    const aiResponse = await generateChatResponse(recentMessages);

    
    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: aiResponse });

    await chat.save();

    res.status(200).json(chat);

  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

// Function 5: deleteChat
export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ error: 'chatId is required' });
    }

    const chat = await Chat.findById(chatId);  

    if (!chat) {
      return res.status(404).json({ error: 'Unable to find the chat' });
    }

    if (chat.isDeleted === true) {
      return res.status(400).json({ error: 'Chat already deleted!' });
    }

    chat.isDeleted = true;
    await chat.save();

    return res.status(200).json({ message: 'Chat deleted successfully' });

  } catch (err) {
    console.error('Error deleting chat:', err);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
}