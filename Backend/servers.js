import 'dotenv/config';
import express from "express";
import cors from 'cors';
import ConnectDb from './Config/database.js';
import chatRoutes from './Routes/chatRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration 
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://w-2mhnn3jk9-rudrakshs-projects-ae82c7e8.vercel.app',
    /\.vercel\.app$/  // to allow all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());

// Connect db
await ConnectDb();

// Routes prefixed 
app.use('/api', chatRoutes);

// Test route
app.get('/', (req, res) => {
  res.send(`the server is running`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
});