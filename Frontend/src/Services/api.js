import axios from 'axios';

// Base URL 
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Created axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Funcs

// 1. Create new chat
export const createNewChat = async (userId, message) => {
  const response = await api.post('/chats', { userId, message });
  return response.data;
};

// 2. Get all user's chats
export const getUserChats = async (userId) => {
  const response = await api.get(`/chats/user/${userId}`);
  return response.data;
};

// 3. Get specific chat by ID
export const getChatById = async (chatId) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
};

// 4. Send message to existing chat
export const sendMessage = async (chatId, message) => {
  const response = await api.post(`/chats/${chatId}/message`, { message });
  return response.data;
};

// 5. Delete chat
export const deleteChat = async (chatId) => {
  const response = await api.delete(`/chats/${chatId}`);
  return response.data;
};

export default api;