import 'dotenv/config';
import express from "express";
import cors from 'cors';
import ConnectDb from './Config/database.js';
import chatRoutes from './Routes/chatRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
// app.use(cors()); // enables cors for front enc used in browser security rule that controls which websites are allowed to talk to which servers.

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true
}));
app.use(express.json());


await ConnectDb();

//routes prefixed with /api vala string
app.use('/api', chatRoutes);


// 5. Test routes
app.get('/', (req, res) => {
  res.send(`the server is running`);
});

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
