import express from 'express';
import mongoose from 'mongoose';
import userrouter from './routes/Authroutes.js';

import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors())



// user api
app.use('/api/v1', userrouter);



async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/shopping');
  console.log("mongodb connects");
}

main().catch(err => console.log(err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('port 8000 connected', PORT);
});
