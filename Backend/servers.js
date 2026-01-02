import 'dotenv/config';
import express from "express";
import cors from 'cors';
import ConnectDb from './Config/database.js';
import chatRoutes from './Routes/chatRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors()); // enables cors for front enc used in browser security rule that controls which websites are allowed to talk to which servers.
app.use(express.json());


await ConnectDb();

//routes prefixed with /api vala string
app.use('/api', chatRoutes);


// 5. Test routes
app.get('/', (req, res) => {
  res.send(`the server is running`);
});


app.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
  
});
